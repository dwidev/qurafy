"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";

export function AuthBrand() {
  return (
    <Link href="/" className="group inline-flex flex-col items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
        <BookOpen className="h-5 w-5" />
      </div>
      <h1 className="text-xl font-black tracking-tighter">Qurafy.io</h1>
    </Link>
  );
}
