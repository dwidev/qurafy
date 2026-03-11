"use client";

import type { Flame } from "lucide-react";

export type ProfileStat = {
  label: string;
  value: number;
  icon: typeof Flame;
  color: string;
  bg: string;
};

export type ProfileAchievement = {
  id: number;
  title: string;
  desc: string;
  icon: typeof Flame;
  color: string;
  bg: string;
};

export type ProfileUserView = {
  name: string;
  username: string;
  email: string;
  location: string;
  bio: string;
  joinedDate: string;
  rank: string;
};
