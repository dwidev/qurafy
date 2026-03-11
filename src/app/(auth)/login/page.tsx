"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User } from "lucide-react";
import { LoadingPopup } from "@/components/ui/LoadingPopup";
import {
  AuthFooter,
  AuthInputField,
  AuthIntro,
  AuthPageFrame,
  AuthStatusMessages,
  AuthSubmitButton,
  GoogleSignInButton,
  PasswordVisibilityButton,
} from "@/features/auth/components/AuthPageSections";
import { authClient } from "@/lib/auth-client";

type AuthMode = "login" | "register" | "forgot";

const modeCopy: Record<AuthMode, { title: string; description: string; submitLabel: string; loadingMessage: string }> = {
  login: {
    title: "Welcome back",
    description: "Enter your details to sign in",
    submitLabel: "Sign In",
    loadingMessage: "Signing you in...",
  },
  register: {
    title: "Create an account",
    description: "Enter your email to join the community",
    submitLabel: "Get Started",
    loadingMessage: "Creating account...",
  },
  forgot: {
    title: "Forgot password",
    description: "Enter your account email to get reset instructions",
    submitLabel: "Send Reset Link",
    loadingMessage: "Sending reset link...",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [mode, setMode] = useState<AuthMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!isSessionPending && session) {
      router.replace("/app");
    }
  }, [isSessionPending, router, session]);

  const isRedirectingAuthenticatedUser = !isSessionPending && Boolean(session);

  if (isSessionPending || isRedirectingAuthenticatedUser) {
    return (
      <div className="min-h-screen bg-background">
        <LoadingPopup
          show
          message={isRedirectingAuthenticatedUser ? "Redirecting to dashboard..." : "Checking session..."}
        />
      </div>
    );
  }

  const resetStateMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleSocialSignIn = async () => {
    resetStateMessages();
    setIsLoading(true);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/app",
      });
    } catch {
      setErrorMessage("Failed to continue with Google.");
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetStateMessages();
    setIsLoading(true);

    if (mode === "forgot") {
      const redirectTo =
        typeof window !== "undefined"
          ? `${window.location.origin}/reset-password`
          : `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? ""}/reset-password`;

      const result = await authClient.requestPasswordReset({
        email,
        redirectTo,
      });

      if (result.error) {
        setErrorMessage(result.error.message || "Failed to send reset link.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("If your email exists, a reset link has been sent.");
      setIsLoading(false);
      return;
    }

    const result =
      mode === "login"
        ? await authClient.signIn.email({
            email,
            password,
            callbackURL: "/app",
          })
        : await authClient.signUp.email({
            email,
            password,
            name,
            callbackURL: "/app",
          });

    if (result.error) {
      setErrorMessage(result.error.message || "Authentication failed.");
      setIsLoading(false);
      return;
    }

    router.push("/app");
    router.refresh();
  };

  return (
    <>
      <AuthPageFrame>
        <AuthIntro title={modeCopy[mode].title} description={modeCopy[mode].description} />

        {mode !== "forgot" ? (
          <div className="space-y-2">
            <GoogleSignInButton disabled={isLoading} onClick={() => void handleSocialSignIn()} />
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-3">
            {mode === "register" ? (
              <AuthInputField
                icon={User}
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={setName}
                required
              />
            ) : null}

            <AuthInputField
              icon={Mail}
              type="email"
              placeholder="Email address"
              value={email}
              onChange={setEmail}
              required
            />

            {mode !== "forgot" ? (
              <AuthInputField
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={setPassword}
                required
                trailing={<PasswordVisibilityButton visible={showPassword} onToggle={() => setShowPassword((prev) => !prev)} />}
              />
            ) : null}
          </div>

          <AuthStatusMessages errorMessage={errorMessage} successMessage={successMessage} />

          {mode === "login" ? (
            <button
              type="button"
              onClick={() => {
                resetStateMessages();
                setMode("forgot");
              }}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Forgot password?
            </button>
          ) : null}

          <AuthSubmitButton label={modeCopy[mode].submitLabel} isLoading={isLoading} />
        </form>

        <AuthFooter>
          {mode === "forgot" ? (
            <p className="text-[11px] font-medium text-muted-foreground">
              Remember your password?{" "}
              <button
                type="button"
                onClick={() => {
                  resetStateMessages();
                  setMode("login");
                }}
                className="font-black text-primary hover:underline"
              >
                Log in
              </button>
            </p>
          ) : (
            <p className="text-[11px] font-medium text-muted-foreground">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  resetStateMessages();
                  setMode(mode === "login" ? "register" : "login");
                }}
                className="font-black text-primary hover:underline"
              >
                {mode === "login" ? "Create one" : "Log in"}
              </button>
            </p>
          )}
        </AuthFooter>
      </AuthPageFrame>

      <LoadingPopup show={isLoading} message={modeCopy[mode].loadingMessage} />
    </>
  );
}
