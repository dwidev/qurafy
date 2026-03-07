export type PrayerName = "Fajr" | "Dhuhr" | "Asr" | "Maghrib" | "Isha";

export type PrayerTiming = {
  name: PrayerName;
  time: string;
};

export type PrayerLocationSource = "gps" | "profile";

export type DashboardPrayerLocation = {
  label: string;
  latitude: number;
  longitude: number;
  source: PrayerLocationSource;
};

export type DashboardQiblaData = {
  degrees: number;
  cardinal: string;
};

export type DashboardPrayerData = {
  location: DashboardPrayerLocation;
  qibla: DashboardQiblaData;
  timeZone: string;
  timings: PrayerTiming[];
  fetchedAt: string;
};

export type DashboardCoordinates = {
  latitude: number;
  longitude: number;
};
