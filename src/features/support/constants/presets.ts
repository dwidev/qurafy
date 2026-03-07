import type { DonationPreset } from "@/types";

export const monthlyPresets: DonationPreset[] = [
  { value: "25000", label: "25K" },
  { value: "50000", label: "50K" },
  { value: "100000", label: "100K" },
  { value: "250000", label: "250K" },
];

export const yearlyPresets: DonationPreset[] = [
  { value: "200000", label: "200K" },
  { value: "500000", label: "500K" },
  { value: "1000000", label: "1M" },
  { value: "2500000", label: "2.5M" },
];

export const sadaqahPresets: DonationPreset[] = [
  { value: "20000", label: "20K" },
  { value: "50000", label: "50K" },
  { value: "100000", label: "100K" },
  { value: "500000", label: "500K" },
];
