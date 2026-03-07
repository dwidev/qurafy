"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, BookOpen, Globe, MapPin, Target, User, UserCircle2 } from "lucide-react";
import { getProfileErrorMessage, isUnauthorizedProfileError, useCompleteProfileMutation, useProfileMeQuery } from "@/features/profile/api/client";
import { useCompleteProfileStore } from "@/features/profile/store/complete-profile-store";
import type { DailyGoalValue, ProfileMeData } from "@/features/profile/types";
import { LoadingPopup } from "@/components/ui/LoadingPopup";
import { Skeleton } from "@/components/ui/skeleton";

const goalOptions: Array<{ value: DailyGoalValue; label: string }> = [
  { value: "build-consistency", label: "Build a daily reading habit" },
  { value: "memorize-juz-amma", label: "Memorize Juz Amma" },
  { value: "finish-khatam", label: "Complete a khatam plan" },
  { value: "learn-tafsir", label: "Understand tafsir deeper" },
];

const totalSteps = 5;

type CompleteProfileFormProps = {
  initialData: ProfileMeData;
};

export function CompleteProfileForm({ initialData }: CompleteProfileFormProps) {
  const router = useRouter();
  const query = useProfileMeQuery({ initialData });
  const completeProfileMutation = useCompleteProfileMutation();

  const {
    step,
    fullName,
    username,
    location,
    dailyGoal,
    bio,
    hydrateFromServer,
    goNextStep,
    goPrevStep,
    setFullName,
    setUsername,
    setLocation,
    setDailyGoal,
    setBio,
    resetForUser,
  } = useCompleteProfileStore();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const profileData = query.data ?? initialData;
  const isEditing = Boolean(profileData.profile);

  useEffect(() => {
    if (query.data) {
      hydrateFromServer(query.data);
    }
  }, [query.data, hydrateFromServer]);

  useEffect(() => {
    if (query.error && isUnauthorizedProfileError(query.error)) {
      router.replace("/login");
    }
  }, [query.error, router]);

  const canGoNext = useMemo(() => {
    if (step === 0) {
      return fullName.trim().length >= 2 && fullName.trim().length <= 80;
    }
    if (step === 1) {
      return /^[a-z0-9_]{3,20}$/.test(username.trim().toLowerCase());
    }
    if (step === 2) {
      return location.trim().length >= 2 && location.trim().length <= 80;
    }
    if (step === 3) {
      return goalOptions.some((option) => option.value === dailyGoal);
    }

    return bio.trim().length >= 10 && bio.trim().length <= 280;
  }, [bio, dailyGoal, fullName, location, step, username]);

  const stepTitle = useMemo(() => {
    if (step === 0) return "Your full name";
    if (step === 1) return "Choose a username";
    if (step === 2) return "Where are you based?";
    if (step === 3) return "Pick your main goal";
    return "Add a short bio";
  }, [step]);

  const stepDescription = useMemo(() => {
    if (step === 0) return "Use your real name for your profile.";
    if (step === 1) return "This will be your unique public handle.";
    if (step === 2) return "This helps personalize your community profile.";
    if (step === 3) return "You can change this later in profile settings.";
    return "Share your current Quran learning journey.";
  }, [step]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    if (!canGoNext) {
      setErrorMessage("Please complete this step first.");
      return;
    }

    if (step < totalSteps - 1) {
      goNextStep();
      return;
    }

    try {
      await completeProfileMutation.mutateAsync({
        fullName,
        username,
        location,
        dailyGoal,
        bio,
      });

      resetForUser(profileData.user.id);
      router.replace("/app");
      router.refresh();
    } catch (error) {
      setErrorMessage(getProfileErrorMessage(error));
    }
  };

  if (query.isLoading && !query.data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-[420px] space-y-7">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
          </div>
          <Skeleton className="h-1.5 w-full rounded-full" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-[420px] space-y-7">
          <div className="text-center space-y-4">
            <Link href="/" className="inline-flex flex-col items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <BookOpen className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-black tracking-tighter">Qurafy.io</h1>
            </Link>

            <div className="space-y-2">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/80">
                Step {step + 1} of {totalSteps}
              </p>
              <h2 className="text-lg font-bold tracking-tight">
                {isEditing ? "Update your profile" : "Complete your profile"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {isEditing
                  ? "Keep your identity and goals up to date"
                  : "One quick step before entering your dashboard"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="h-1.5 w-full rounded-full bg-secondary/70 overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                />
              </div>

              <div>
                <h3 className="text-sm font-black tracking-tight">{stepTitle}</h3>
                <p className="text-xs text-muted-foreground mt-1">{stepDescription}</p>
              </div>

              {step === 0 ? (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-3.5 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                    required
                    autoFocus
                  />
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                      <UserCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <input
                      type="text"
                      placeholder="Username (letters, numbers, underscore)"
                      value={username}
                      onChange={(event) => setUsername(event.target.value.toLowerCase())}
                      className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-3.5 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                      required
                      minLength={3}
                      maxLength={20}
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">Example: `abdullah_rahman`</p>
                </div>
              ) : null}

              {step === 2 ? (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="w-full h-10 bg-secondary/30 border border-border rounded-lg pl-10 pr-3.5 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50"
                    required
                    minLength={2}
                    maxLength={80}
                    autoFocus
                  />
                </div>
              ) : null}

              {step === 3 ? (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-muted-foreground/50 transition-colors group-focus-within:text-primary z-10">
                    <Target className="h-3.5 w-3.5" />
                  </div>
                  <select
                    value={dailyGoal}
                    onChange={(event) => setDailyGoal(event.target.value as DailyGoalValue)}
                    className="w-full h-10 appearance-none bg-secondary/30 border border-border rounded-lg pl-10 pr-8 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all"
                    autoFocus
                  >
                    {goalOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <Globe className="absolute right-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                </div>
              ) : null}

              {step === 4 ? (
                <textarea
                  placeholder="Short bio"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                  className="w-full min-h-28 bg-secondary/30 border border-border rounded-lg px-3.5 py-3 text-xs font-bold focus:outline-hidden focus:border-primary/50 focus:bg-card transition-all placeholder:text-muted-foreground/50 resize-none"
                  required
                  minLength={10}
                  maxLength={280}
                  autoFocus
                />
              ) : null}
            </div>

            <p className="text-[11px] text-muted-foreground font-medium">Signed in as {profileData.user.email}</p>
            {errorMessage ? <p className="text-xs text-destructive font-semibold">{errorMessage}</p> : null}

            <div className="flex items-center gap-2">
              {step > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    goPrevStep();
                  }}
                  className="h-11 px-4 rounded-xl border border-border bg-card text-xs font-black hover:bg-secondary/50 transition-colors"
                >
                  Back
                </button>
              ) : null}

              <button
                type="submit"
                disabled={completeProfileMutation.isPending}
                className="flex-1 h-11 bg-primary text-primary-foreground rounded-xl text-xs font-black shadow-lg shadow-primary/10 hover:bg-primary/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {completeProfileMutation.isPending ? (
                  <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {step < totalSteps - 1
                      ? "Next"
                      : isEditing
                        ? "Save Profile"
                        : "Continue to Dashboard"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <LoadingPopup show={completeProfileMutation.isPending} message="Saving your profile..." />
    </>
  );
}
