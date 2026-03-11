"use client";

import { Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { LoadingPopup } from "@/components/ui/LoadingPopup";
import {
  AuthFooter,
  AuthInputField,
  AuthIntro,
  AuthPageFrame,
  AuthStatusMessages,
  AuthSubmitButton,
  PasswordVisibilityButton,
} from "@/features/auth/components/AuthPageSections";
import { authClient } from "@/lib/auth-client";

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

  return (
    <>
      <AuthPageFrame>
        <AuthIntro title="Reset password" description="Create a new password for your account" />

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3">
            <AuthInputField
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={newPassword}
              onChange={setNewPassword}
              required
              disabled={Boolean(tokenError)}
              trailing={<PasswordVisibilityButton visible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />}
            />

            <AuthInputField
              icon={Lock}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              required
              disabled={Boolean(tokenError)}
            />
          </div>

          <AuthStatusMessages errorMessage={tokenError ?? errorMessage} successMessage={successMessage} />
          <AuthSubmitButton label="Update Password" isLoading={isLoading} disabled={Boolean(tokenError)} />
        </form>

        <AuthFooter>
          <p className="text-[11px] font-medium text-muted-foreground">
            Back to{" "}
            <Link href="/login" className="font-black text-primary hover:underline">
              Login
            </Link>
          </p>
        </AuthFooter>
      </AuthPageFrame>

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
