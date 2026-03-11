"use client";

export const MEMORIZE_SESSION_DONE_STORAGE_KEY = "memorize.session.done";

export type MemorizeSessionPhase = "listening" | "reciting";

export type MemorizeSessionVerse = {
  n: number;
  ar: string;
  tr: string;
};

export function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
