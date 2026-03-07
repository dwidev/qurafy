"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, BookOpen, Eye, EyeOff, Lock } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { LoadingPopup } from "@/components/ui/LoadingPopup";

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const tokenError = useMemo(() => {
    if (error === "INVALID_TOKEN") {
      return "Reset link is invalid or expired.";
    }
    if (!token) {
      return "Reset token is missing.";
    }
    return null;
  }, [error, token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setErrorMessage("Reset token is missing.");
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    const result = await authClient.resetPassword({
      newPassword,
      token,
    });

    if (result.error) {
      setErrorMessage(result.error.message || "Failed to reset password.");
      setIsLoading(false);
      return;
    }

    setSuccessMessage("Password updated. Redirecting to login...");
    setIsLoading(false);
    setTimeout(() => {
      router.replace("/login");
    }, 1200);
  };

  const displayError = tokenError ?? errorMessage;

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-[360px] space-y-7">
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex flex-col items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <BookOpen className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-black tracking-tighter">Qurafy.io</h1>
            </Link>

            <div className="space-y-1">
              <h2 className="text-lg font-bold tracking-tight">Reset password</h2>
              <p className="text-xs text-muted-foreground">Create a new password for your account</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-10 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                  required
                  disabled={Boolean(tokenError)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-10 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                  required
                  disabled={Boolean(tokenError)}
                />
              </div>
            </div>

            {displayError && <p className="text-xs text-destructive font-semibold">{displayError}</p>}
            {successMessage && <p className="text-xs text-emerald-600 font-semibold">{successMessage}</p>}

            <button
              type="submit"
              disabled={isLoading || Boolean(tokenError)}
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-xs font-black shadow-lg shadow-primary/10 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Update Password
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <p className="text-[11px] text-center text-muted-foreground font-medium">
            Back to{" "}
            <Link href="/login" className="text-primary font-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <LoadingPopup show={isLoading} message="Updating password..." />
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background">
          <LoadingPopup show message="Loading reset form..." />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}
