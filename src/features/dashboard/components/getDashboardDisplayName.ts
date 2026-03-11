"use client";

export function getDashboardDisplayName(name: string) {
  return name.split(" ")[0]?.trim() || "User";
}
