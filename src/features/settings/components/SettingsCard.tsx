"use client";

export function SettingsCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
      <h3 className="text-xl font-bold">{title}</h3>
      {children}
    </div>
  );
}
