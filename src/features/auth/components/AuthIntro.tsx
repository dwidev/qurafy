"use client";

import { AuthBrand } from "@/features/auth/components/AuthBrand";

export function AuthIntro({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-4 text-center">
      <AuthBrand />
      <div className="space-y-1">
        <h2 className="text-lg font-bold tracking-tight">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}
