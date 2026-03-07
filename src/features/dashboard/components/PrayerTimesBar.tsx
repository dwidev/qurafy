"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Compass, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getPrayerTimesErrorMessage, usePrayerTimesQuery } from "@/features/dashboard/prayer-times/api/client";
import { usePrayerLocationStore } from "@/features/dashboard/prayer-times/store/location-store";
import type { PrayerTiming } from "@/features/dashboard/prayer-times/types";

function parseTimeToMinutes(time: string) {
  const [hourRaw, minuteRaw] = time.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw);

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }

  return hour * 60 + minute;
}

function getCurrentMinutesInTimezone(timeZone: string, now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);

  const hour = Number(parts.find((part) => part.type === "hour")?.value ?? "NaN");
  const minute = Number(parts.find((part) => part.type === "minute")?.value ?? "NaN");

  if (!Number.isFinite(hour) || !Number.isFinite(minute)) {
    return null;
  }

  return hour * 60 + minute;
}

function getActivePrayerName(timings: PrayerTiming[], timeZone: string, now: Date) {
  const nowMinutes = getCurrentMinutesInTimezone(timeZone, now);

  if (nowMinutes === null || timings.length === 0) {
    return null;
  }

  const schedule = timings
    .map((timing) => ({
      ...timing,
      minutes: parseTimeToMinutes(timing.time),
    }))
    .filter((timing) => timing.minutes !== null) as Array<PrayerTiming & { minutes: number }>;

  if (schedule.length === 0) {
    return null;
  }

  if (nowMinutes < schedule[0].minutes) {
    return schedule[schedule.length - 1].name;
  }

  for (let index = 0; index < schedule.length - 1; index += 1) {
    if (nowMinutes >= schedule[index].minutes && nowMinutes < schedule[index + 1].minutes) {
      return schedule[index].name;
    }
  }

  return schedule[schedule.length - 1].name;
}

export function PrayerTimesBar() {
  const coordinates = usePrayerLocationStore((state) => state.coordinates);
  const permission = usePrayerLocationStore((state) => state.permission);
  const locationError = usePrayerLocationStore((state) => state.error);
  const setRequesting = usePrayerLocationStore((state) => state.setRequesting);
  const setCoordinates = usePrayerLocationStore((state) => state.setCoordinates);
  const setDenied = usePrayerLocationStore((state) => state.setDenied);
  const setUnsupported = usePrayerLocationStore((state) => state.setUnsupported);
  const clearError = usePrayerLocationStore((state) => state.clearError);

  const prayerQuery = usePrayerTimesQuery(coordinates);
  const [now, setNow] = useState(() => new Date());

  const requestLocation = useCallback(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!("geolocation" in navigator)) {
      setUnsupported();
      return;
    }

    setRequesting();

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setDenied("Location permission denied. Using profile location if available.");
          return;
        }

        setDenied("Unable to detect your location. Using profile location if available.");
      },
      {
        enableHighAccuracy: false,
        timeout: 8_000,
        maximumAge: 10 * 60 * 1000,
      },
    );
  }, [setCoordinates, setDenied, setRequesting, setUnsupported]);

  useEffect(() => {
    if (!coordinates && permission === "idle") {
      requestLocation();
    }
  }, [coordinates, permission, requestLocation]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setNow(new Date());
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const activePrayerName = useMemo(() => {
    if (!prayerQuery.data) {
      return null;
    }

    return getActivePrayerName(prayerQuery.data.timings, prayerQuery.data.timeZone, now);
  }, [now, prayerQuery.data]);

  const displayError = prayerQuery.data
    ? null
    : locationError ?? (prayerQuery.isError ? getPrayerTimesErrorMessage(prayerQuery.error) : null);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 md:p-1 md:pr-4 rounded-4xl border border-border bg-card shadow-sm group hover:border-primary/20 transition-all">
      <div className="flex items-center gap-3 bg-secondary/50 rounded-full px-4 py-2 self-start md:self-auto w-full md:w-auto min-h-10">
        {prayerQuery.isLoading && !prayerQuery.data ? (
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-28" />
            <div className="h-4 w-px bg-border/50 mx-1" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : prayerQuery.data ? (
          <>
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <span className="text-xs font-bold truncate max-w-[150px]" title={prayerQuery.data.location.label}>
              {prayerQuery.data.location.label}
            </span>
            <div className="h-4 w-px bg-border/50 mx-1" />
            <Compass className="h-4 w-4 text-emerald-500 shrink-0" />
            <span className="text-xs font-bold whitespace-nowrap">
              {prayerQuery.data.qibla.degrees.toFixed(1)} deg {prayerQuery.data.qibla.cardinal}
            </span>
          </>
        ) : (
          <>
            <AlertCircle className="h-4 w-4 text-destructive shrink-0" />
            <span className="text-xs font-semibold text-destructive/90 truncate max-w-[240px]" title={displayError ?? "Prayer data unavailable."}>
              {displayError ?? "Prayer data unavailable."}
            </span>
          </>
        )}
      </div>

      <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8 overflow-x-auto no-scrollbar py-1">
        {prayerQuery.isLoading && !prayerQuery.data
          ? Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center min-w-[50px] gap-2">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-4 w-12" />
              </div>
            ))
          : prayerQuery.data?.timings.map((timing) => {
              const isActive = timing.name === activePrayerName;

              return (
                <div key={timing.name} className="flex flex-col items-center min-w-[50px]">
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {timing.name}
                  </span>
                  <span className={`text-sm font-black ${isActive ? "text-foreground" : "text-muted-foreground/60"}`}>
                    {timing.time}
                  </span>
                  {isActive ? <div className="h-1 w-4 bg-primary rounded-full mt-1 animate-pulse" /> : null}
                </div>
              );
            })}
      </div>

      {displayError ? (
        <button
          type="button"
          onClick={() => {
            clearError();
            requestLocation();
            void prayerQuery.refetch();
          }}
          className="text-[11px] font-semibold text-primary hover:underline whitespace-nowrap"
        >
          Retry Location
        </button>
      ) : null}
    </div>
  );
}
