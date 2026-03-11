"use client";

export function AuthPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-[360px] space-y-7">{children}</div>
    </div>
  );
}
