"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { LoadingPopup } from "@/components/ui/LoadingPopup";
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
  redirectTo = "/",
  showLabel = false,
}: LogoutButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) return;

    setIsLoading(true);

    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    if (!response.ok) {
      setIsLoading(false);
      return;
    }

    authClient.$store.notify("$sessionSignal");
    onDone?.();
    router.replace(redirectTo);
    router.refresh();
  };

  return (
    <>
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
      <LoadingPopup show={isLoading} message="Signing you out..." />
    </>
  );
}
