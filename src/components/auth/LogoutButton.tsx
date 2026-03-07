"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type LogoutButtonProps = {
  className?: string;
  iconClassName?: string;
  onDone?: () => void;
  redirectTo?: string;
  showLabel?: boolean;
};

export function LogoutButton({
  className,
  iconClassName,
  onDone,
  redirectTo = "/login",
  showLabel = false,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const result = await authClient.signOut();

    if (result.error) {
      setIsLoading(false);
      return;
    }

    onDone?.();
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className={cn("inline-flex items-center gap-2", className)}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <LogOut className={cn("h-4 w-4", iconClassName)} />
      )}
      {showLabel ? <span>{isLoading ? "Signing out..." : "Log Out"}</span> : null}
    </button>
  );
}
