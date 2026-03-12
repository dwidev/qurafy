"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  getReadErrorMessage,
  isUnauthorizedReadError,
  useReadContentQuery,
} from "@/features/read/api/client";
import { ReaderPageSkeleton } from "@/features/read/components/ReaderPageSkeleton";
import { getKhatamErrorMessage, useToggleKhatamDayMutation } from "@/features/tracker/api/client";
import {
  KhatamCompletionCard,
  ReaderBody,
  ReaderFeedbackState,
  ReaderHeader,
  ReaderSettingsPanel,
  type ReaderSettings,
} from "@/features/read/components/ReaderPageSections";
import { settingsStorageKey } from "@/features/settings/constants";

const arabicScale = ["text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl", "text-7xl", "text-8xl"];

function ReaderContent() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const idStr = typeof params?.id === "string" ? params.id : "";
  const isKhatamMode = searchParams?.get("khatam") === "true";
  const khatamPlanId = searchParams?.get("planId") ?? "";
  const scheduledDate = searchParams?.get("scheduledDate") ?? "";
  const returnTo = searchParams?.get("returnTo") ?? "/app/tracker";
  const { data, isLoading, isError, error, refetch } = useReadContentQuery(idStr);
  const toggleKhatamDayMutation = useToggleKhatamDayMutation();

  const [showSettings, setShowSettings] = useState(false);
  const [khatamCompleteError, setKhatamCompleteError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ReaderSettings>(() => {
    if (typeof window === "undefined") {
      return {
        mode: "verse",
        showTranslation: true,
        showTransliteration: true,
        arabicSize: 4,
      };
    }

    const raw = window.localStorage.getItem(settingsStorageKey);

    if (!raw) {
      return {
        mode: "verse",
        showTranslation: true,
        showTransliteration: true,
        arabicSize: 4,
      };
    }

    try {
      const parsed = JSON.parse(raw) as {
        reading?: ReaderSettings;
      };

      return parsed.reading ?? {
        mode: "verse",
        showTranslation: true,
        showTransliteration: true,
        arabicSize: 4,
      };
    } catch {
      return {
        mode: "verse",
        showTranslation: true,
        showTransliteration: true,
        arabicSize: 4,
      };
    }
  });

  useEffect(() => {
    if (error && isUnauthorizedReadError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  const updateSetting = <K extends keyof ReaderSettings>(key: K, value: ReaderSettings[K]) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleKhatamComplete = async () => {
    setKhatamCompleteError(null);

    if (!khatamPlanId) {
      setKhatamCompleteError("Missing khatam plan context. Please return to tracker and continue from there.");
      return;
    }

    try {
      await toggleKhatamDayMutation.mutateAsync({
        planId: khatamPlanId,
        scheduledDate: scheduledDate || undefined,
        forceDone: true,
        completedVerses: data?.verses.length ?? 0,
      });
      router.push(returnTo);
    } catch (caughtError) {
      setKhatamCompleteError(getKhatamErrorMessage(caughtError));
    }
  };

  if (!idStr) {
    return (
      <ReaderFeedbackState
        title="Invalid read content"
        message="The requested Quran reference is missing."
        primaryActionLabel="Back to Read"
        onPrimaryAction={() => router.push("/app/read")}
      />
    );
  }

  if (isError) {
    return (
      <ReaderFeedbackState
        title="Could not load Quran content"
        message={getReadErrorMessage(error)}
        primaryActionLabel="Retry"
        onPrimaryAction={() => refetch()}
        secondaryActionLabel="Back to Read"
        onSecondaryAction={() => router.push("/app/read")}
      />
    );
  }

  if (isLoading || !data) {
    return <ReaderPageSkeleton />;
  }

  return (
    <div className="flex h-full flex-col relative pb-24 md:pb-6">
      <ReaderHeader
        title={data.title}
        subtitle={data.subtitle}
        isKhatamMode={isKhatamMode}
        showSettings={showSettings}
        onBack={() => router.back()}
        onToggleSettings={() => setShowSettings((prev) => !prev)}
      />

      {showSettings ? (
        <ReaderSettingsPanel
          settings={settings}
          onClose={() => setShowSettings(false)}
          onUpdate={updateSetting}
        />
      ) : null}

      {data.bismillah ? (
        <div className="py-8 pt-10 text-center text-3xl font-serif text-foreground/90 font-bold border-b border-border/40 mb-2">
          {data.bismillah}
        </div>
      ) : null}

      <div className="flex-1 overflow-auto p-4 md:p-8 max-w-4xl mx-auto w-full">
        <ReaderBody data={data} arabicScaleClass={arabicScale[settings.arabicSize - 1]} settings={settings} />

        {isKhatamMode ? (
          <KhatamCompletionCard
            isPending={toggleKhatamDayMutation.isPending}
            error={khatamCompleteError}
            onComplete={() => {
              void handleKhatamComplete();
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default function SurahReaderPage() {
  return (
    <Suspense fallback={<ReaderPageSkeleton />}>
      <ReaderContent />
    </Suspense>
  );
}
