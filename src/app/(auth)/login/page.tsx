"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Eye, EyeOff, Lock, Mail, Sparkles, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { LoadingPopup } from "@/components/ui/LoadingPopup";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, isPending: isSessionPending } = authClient.useSession();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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

  const handleSocialSignIn = async () => {
    setErrorMessage(null);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

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
            <h2 className="text-lg font-bold tracking-tight">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h2>
            <p className="text-xs text-muted-foreground">
              {mode === "login" ? "Enter your details to sign in" : "Enter your email to join the community"}
            </p>
          </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleSocialSignIn}
              className="w-full flex items-center justify-center gap-2.5 h-11 rounded-xl border border-border bg-card hover:bg-muted transition-all text-xs font-black disabled:opacity-70"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-3">
              {mode === "register" && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-3.5 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                    required
                  />
                </div>
              )}

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-3.5 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-10 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-muted-foreground/50 hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>

            {errorMessage && <p className="text-xs text-destructive font-semibold">{errorMessage}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary text-primary-foreground rounded-xl text-xs font-black shadow-lg shadow-primary/10 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Get Started"}
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-4 pt-1">
            <p className="text-[11px] text-muted-foreground font-medium">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary font-black hover:underline"
              >
                {mode === "login" ? "Create one" : "Log in"}
              </button>
            </p>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-muted-foreground font-bold uppercase tracking-wider opacity-30">
              <Sparkles className="h-2.5 w-2.5" />
              Digital Islamic Excellence
            </div>
          </div>
        </div>
      </div>
      <LoadingPopup show={isLoading} message="Signing you in..." />
    </>
  );
}
