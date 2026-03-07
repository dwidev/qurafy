import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userProfile } from "@/db/schema";
import { getServerSession } from "@/features/auth/server/session";
import type { DashboardPrayerData, PrayerName } from "@/features/dashboard/prayer-times/types";

export const dynamic = "force-dynamic";

const prayerOrder: PrayerName[] = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];
const GEO_REVALIDATE_SECONDS = 12 * 60 * 60;
const PRAYER_REVALIDATE_SECONDS = 5 * 60;
const QIBLA_REVALIDATE_SECONDS = 30 * 24 * 60 * 60;

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseCoordinate(value: string | null, min: number, max: number) {
  if (value === null || value.trim().length === 0) {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < min || parsed > max) {
    return Number.NaN;
  }

  return parsed;
}

function toCardinal(degrees: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round((((degrees % 360) + 360) % 360) / 45) % directions.length;
  return directions[index];
}

function cleanTiming(raw: string) {
  return raw.replace(/\s*\(.+\)$/, "").trim();
}

function buildLocationLabel(city: string | null | undefined, country: string | null | undefined) {
  const safeCity = city?.trim();
  const safeCountry = country?.trim();

  if (safeCity && safeCountry) {
    return `${safeCity}, ${safeCountry}`;
  }

  if (safeCity) {
    return safeCity;
  }

  if (safeCountry) {
    return safeCountry;
  }

  return "Current location";
}

async function geocodeLocation(locationQuery: string) {
  const normalizedQuery = locationQuery.trim().toLowerCase();
  const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(normalizedQuery)}`;
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Qurafy/1.0",
      Accept: "application/json",
    },
    next: {
      revalidate: GEO_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as Array<{
    lat: string;
    lon: string;
    address?: {
      city?: string;
      town?: string;
      village?: string;
      state?: string;
      country?: string;
      country_code?: string;
    };
  }>;

  const first = payload[0];

  if (!first) {
    return null;
  }

  const latitude = Number(first.lat);
  const longitude = Number(first.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  const city = first.address?.city ?? first.address?.town ?? first.address?.village ?? first.address?.state;
  const country = first.address?.country_code?.toUpperCase() ?? first.address?.country;

  return {
    latitude,
    longitude,
    label: buildLocationLabel(city, country),
  };
}

async function reverseGeocode(latitude: number, longitude: number) {
  const normalizedLatitude = Number(latitude.toFixed(4));
  const normalizedLongitude = Number(longitude.toFixed(4));
  const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${normalizedLatitude}&longitude=${normalizedLongitude}&localityLanguage=en`;
  const response = await fetch(url, {
    next: {
      revalidate: GEO_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    city?: string;
    locality?: string;
    principalSubdivision?: string;
    countryCode?: string;
    countryName?: string;
  };

  const city = payload.city ?? payload.locality ?? payload.principalSubdivision;
  const country = payload.countryCode ?? payload.countryName;

  return buildLocationLabel(city, country);
}

async function fetchPrayerTimings(latitude: number, longitude: number) {
  const normalizedLatitude = Number(latitude.toFixed(4));
  const normalizedLongitude = Number(longitude.toFixed(4));
  const url = `https://api.aladhan.com/v1/timings?latitude=${normalizedLatitude}&longitude=${normalizedLongitude}&method=2`;
  const response = await fetch(url, {
    next: {
      revalidate: PRAYER_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    data?: {
      timings?: Partial<Record<PrayerName, string>>;
      meta?: { timezone?: string };
    };
  };

  const timings = payload.data?.timings;

  if (!timings) {
    return null;
  }

  const prayerTimings = prayerOrder.map((name) => ({
    name,
    time: cleanTiming(timings[name] ?? ""),
  }));

  if (prayerTimings.some((item) => item.time.length === 0)) {
    return null;
  }

  return {
    timeZone: payload.data?.meta?.timezone ?? "UTC",
    timings: prayerTimings,
  };
}

async function fetchQiblaDirection(latitude: number, longitude: number) {
  const normalizedLatitude = Number(latitude.toFixed(4));
  const normalizedLongitude = Number(longitude.toFixed(4));
  const url = `https://api.aladhan.com/v1/qibla/${normalizedLatitude}/${normalizedLongitude}`;
  const response = await fetch(url, {
    next: {
      revalidate: QIBLA_REVALIDATE_SECONDS,
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    data?: {
      direction?: number;
    };
  };

  const direction = payload.data?.direction;

  if (!Number.isFinite(direction)) {
    return null;
  }

  return Number(direction);
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();

  if (!session) {
    return jsonError("Unauthorized", 401);
  }

  const latitudeParam = parseCoordinate(request.nextUrl.searchParams.get("latitude"), -90, 90);
  const longitudeParam = parseCoordinate(request.nextUrl.searchParams.get("longitude"), -180, 180);

  if (Number.isNaN(latitudeParam) || Number.isNaN(longitudeParam)) {
    return jsonError("Invalid coordinates provided.", 400);
  }

  if ((latitudeParam === null) !== (longitudeParam === null)) {
    return jsonError("Latitude and longitude must be provided together.", 400);
  }

  try {
    let latitude = latitudeParam;
    let longitude = longitudeParam;
    let locationLabel = "Current location";
    let source: DashboardPrayerData["location"]["source"] = "gps";

    if (latitude === null || longitude === null) {
      const profile = await db.query.userProfile.findFirst({
        where: eq(userProfile.userId, session.user.id),
      });

      if (!profile?.location) {
        return jsonError("Location is not set yet. Please enable browser location or complete your profile location.", 400);
      }

      const geocoded = await geocodeLocation(profile.location);

      if (!geocoded) {
        return jsonError("Unable to resolve your profile location.", 400);
      }

      latitude = geocoded.latitude;
      longitude = geocoded.longitude;
      locationLabel = geocoded.label;
      source = "profile";
    }

    if (latitude === null || longitude === null) {
      return jsonError("Location unavailable.", 400);
    }

    const [timingsData, qiblaDegrees, reverseLabel] = await Promise.all([
      fetchPrayerTimings(latitude, longitude),
      fetchQiblaDirection(latitude, longitude),
      source === "gps" ? reverseGeocode(latitude, longitude) : Promise.resolve(null),
    ]);

    if (!timingsData) {
      return jsonError("Unable to fetch prayer times right now.", 502);
    }

    if (qiblaDegrees === null) {
      return jsonError("Unable to fetch Qibla direction right now.", 502);
    }

    const payload: DashboardPrayerData = {
      location: {
        label: reverseLabel ?? locationLabel,
        latitude,
        longitude,
        source,
      },
      qibla: {
        degrees: Number(qiblaDegrees.toFixed(1)),
        cardinal: toCardinal(qiblaDegrees),
      },
      timeZone: timingsData.timeZone,
      timings: timingsData.timings,
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch {
    return jsonError("Failed to load prayer data.", 500);
  }
}
