"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { authClient } from "@/lib/auth-client";
import { LoadingPopup } from "@/components/ui/LoadingPopup";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getSettingsErrorMessage,
  isUnauthorizedSettingsError,
  persistSettingsLocally,
  readPersistedSettings,
  useDeleteAccountMutation,
  useLogoutAllSessionsMutation,
  useSaveAccountSettingsMutation,
  useSavePreferencesMutation,
  useSettingsPageQuery,
} from "@/features/settings/api/client";
import {
  defaultAppearanceSettings,
  defaultNotificationSettings,
  defaultReadingSettings,
} from "@/features/settings/constants";
import {
  AccountSettingsSection,
  AppearanceSettingsSection,
  BillingSettingsSection,
  GeneralSettingsSection,
  NotificationSettingsSection,
  ReadingSettingsSection,
  SecuritySettingsSection,
  SettingsHeader,
  SettingsSidebar,
} from "@/features/settings/components/SettingsPageSections";
import type {
  AppearanceSettings,
  NotificationSettings,
  ReadingSettings,
  SettingsPageData,
  SettingsAccountData,
  SettingsTab,
} from "@/features/settings/types";

function formatCacheSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getQurafyCacheSize() {
  if (typeof window === "undefined") {
    return 0;
  }

  let bytes = 0;

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);

    if (!key || !key.startsWith("qurafy-")) {
      continue;
    }

    const value = window.localStorage.getItem(key) ?? "";
    bytes += key.length + value.length;
  }

  return bytes * 2;
}

function SettingsPageSkeleton() {
  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-32 pt-6 md:p-8">
      <div className="space-y-3">
        <Skeleton className="h-10 w-40 rounded-xl" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <div className="space-y-2">
          {Array.from({ length: 7 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full rounded-2xl" />
          ))}
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-7 w-44" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-24 w-full rounded-2xl" />
              </div>

              <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-52" />
                <Skeleton className="h-11 w-32 rounded-full" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
            <div className="space-y-4">
              <Skeleton className="h-6 w-40" />
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full rounded-2xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useSettingsPageQuery();
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  useEffect(() => {
    if (error && isUnauthorizedSettingsError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isLoading || !data) {
    return <SettingsPageSkeleton />;
  }

  if (isError) {
    return (
      <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-32 pt-6 md:p-8">
        <SettingsHeader />
        <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
          <p className="text-sm font-medium text-destructive">{getSettingsErrorMessage(error)}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <SettingsPageContent
      data={data}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}

function SettingsPageContent({
  data,
  activeTab,
  onTabChange,
}: {
  data: SettingsPageData;
  activeTab: SettingsTab;
  onTabChange: (tab: SettingsTab) => void;
}) {
  const router = useRouter();
  const { setTheme } = useTheme();
  const savePreferencesMutation = useSavePreferencesMutation();
  const saveAccountMutation = useSaveAccountSettingsMutation();
  const logoutAllSessionsMutation = useLogoutAllSessionsMutation();
  const deleteAccountMutation = useDeleteAccountMutation();

  const persisted = readPersistedSettings();
  const [account, setAccount] = useState<SettingsAccountData>(data.account);
  const [notifications, setNotifications] = useState<NotificationSettings>(data.notifications ?? persisted.notifications ?? defaultNotificationSettings);
  const [appearance, setAppearance] = useState<AppearanceSettings>(data.appearance ?? persisted.appearance ?? defaultAppearanceSettings);
  const [reading, setReading] = useState<ReadingSettings>(data.reading ?? persisted.reading ?? defaultReadingSettings);
  const [cacheSizeLabel, setCacheSizeLabel] = useState(() => formatCacheSize(getQurafyCacheSize()));
  const [cacheMessage, setCacheMessage] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [preferencesError, setPreferencesError] = useState<string | null>(null);
  const [preferencesSuccess, setPreferencesSuccess] = useState<string | null>(null);
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [passwordResetMessage, setPasswordResetMessage] = useState<string | null>(null);
  const [isSendingPasswordReset, setIsSendingPasswordReset] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setTheme(appearance.theme);
  }, [appearance.theme, setTheme]);

  useEffect(() => {
    persistSettingsLocally({
      notifications,
      appearance,
      reading,
    });
  }, [appearance, notifications, reading]);

  const isAccountDirty = useMemo(
    () => JSON.stringify(account) !== JSON.stringify(data.account),
    [account, data.account],
  );
  const areNotificationsDirty = useMemo(
    () => JSON.stringify(notifications) !== JSON.stringify(data.notifications),
    [data.notifications, notifications],
  );
  const isAppearanceDirty = useMemo(
    () => JSON.stringify(appearance) !== JSON.stringify(data.appearance),
    [appearance, data.appearance],
  );
  const isReadingDirty = useMemo(
    () => JSON.stringify(reading) !== JSON.stringify(data.reading),
    [data.reading, reading],
  );

  const syncAppearanceWithReading = (nextReading: ReadingSettings) => {
    setReading(nextReading);
    setAppearance((prev) => ({
      ...prev,
      mushafMode: nextReading.mode === "mushaf",
      fontSize: nextReading.arabicSize,
    }));
  };

  const handlePreferencesSave = async (scope: "notifications" | "appearance" | "reading") => {
    setPreferencesError(null);
    setPreferencesSuccess(null);

    try {
      await savePreferencesMutation.mutateAsync({
        notifications,
        appearance,
        reading,
      });

      setPreferencesSuccess(
        scope === "notifications"
          ? "Notification settings updated."
          : scope === "appearance"
            ? "Appearance preferences updated."
            : "Reading preferences updated.",
      );
    } catch (caughtError) {
      setPreferencesError(getSettingsErrorMessage(caughtError));
    }
  };

  const handleAccountSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAccountError(null);
    setAccountSuccess(null);

    try {
      await saveAccountMutation.mutateAsync({
        fullName: account.fullName,
        username: account.username,
        location: account.location,
        bio: account.bio,
        dailyGoal: account.dailyGoal,
      });
      setAccountSuccess("Account settings saved.");
    } catch (caughtError) {
      setAccountError(getSettingsErrorMessage(caughtError));
    }
  };

  const handleClearCache = () => {
    if (typeof window === "undefined") {
      return;
    }

    const keysToRemove: string[] = [];

    for (let index = 0; index < window.localStorage.length; index += 1) {
      const key = window.localStorage.key(index);

      if (key && key.startsWith("qurafy-")) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      window.localStorage.removeItem(key);
    });

    setCacheSizeLabel(formatCacheSize(getQurafyCacheSize()));
    setCacheMessage("Local Qurafy cache cleared for this browser.");
  };

  const handlePasswordReset = async () => {
    setSecurityError(null);
    setPasswordResetMessage(null);
    setIsSendingPasswordReset(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/reset-password`
        : `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL ?? ""}/reset-password`;

    const result = await authClient.requestPasswordReset({
      email: account.email,
      redirectTo,
    });

    setIsSendingPasswordReset(false);

    if (result.error) {
      setSecurityError(result.error.message || "Failed to send reset link.");
      return;
    }

    setPasswordResetMessage("Password reset email sent.");
  };

  const handleLogoutAll = async () => {
    setSecurityError(null);

    try {
      await logoutAllSessionsMutation.mutateAsync();
      authClient.$store.notify("$sessionSignal");
      router.replace("/login");
      router.refresh();
    } catch (caughtError) {
      setSecurityError(getSettingsErrorMessage(caughtError));
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteErrorMessage(null);

    try {
      await deleteAccountMutation.mutateAsync(deleteConfirmation);
      authClient.$store.notify("$sessionSignal");
      setIsDeleteDialogOpen(false);
      setDeleteConfirmation("");
      router.replace("/login");
      router.refresh();
    } catch (caughtError) {
      setDeleteErrorMessage(getSettingsErrorMessage(caughtError));
    }
  };

  const openDeleteDialog = () => {
    setDeleteErrorMessage(null);
    setDeleteConfirmation("");
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleteAccountMutation.isPending) {
      return;
    }

    setDeleteErrorMessage(null);
    setDeleteConfirmation("");
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-32 pt-6 md:p-8">
        <SettingsHeader />

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <SettingsSidebar activeTab={activeTab} onTabChange={onTabChange} />

          <div className="animate-in space-y-8 fade-in slide-in-from-right-4 duration-500">
            {activeTab === "general" ? (
              <GeneralSettingsSection
                appVersion={data.appVersion}
                cacheSizeLabel={cacheSizeLabel}
                onClearCache={handleClearCache}
                cacheMessage={cacheMessage}
              />
            ) : null}

            {activeTab === "account" ? (
              <AccountSettingsSection
                form={account}
                onChange={(key, value) => setAccount((prev) => ({ ...prev, [key]: value }))}
                onSubmit={handleAccountSave}
                isSaving={saveAccountMutation.isPending}
                isDirty={isAccountDirty}
                errorMessage={accountError}
                successMessage={accountSuccess}
                onOpenDeleteDialog={openDeleteDialog}
                onCloseDeleteDialog={closeDeleteDialog}
                onConfirmDeleteAccount={() => void handleDeleteAccount()}
                isDeleteDialogOpen={isDeleteDialogOpen}
                deleteConfirmation={deleteConfirmation}
                onDeleteConfirmationChange={setDeleteConfirmation}
                isDeleting={deleteAccountMutation.isPending}
                deleteErrorMessage={deleteErrorMessage}
              />
            ) : null}

            {activeTab === "notifications" ? (
              <NotificationSettingsSection
                notifications={notifications}
                onToggle={(key) => {
                  setPreferencesError(null);
                  setPreferencesSuccess(null);
                  setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  void handlePreferencesSave("notifications");
                }}
                isSaving={savePreferencesMutation.isPending}
                isDirty={areNotificationsDirty}
                errorMessage={preferencesError}
                successMessage={preferencesSuccess}
              />
            ) : null}

            {activeTab === "appearance" ? (
              <AppearanceSettingsSection
                appearance={appearance}
                onThemeChange={(theme) => {
                  setPreferencesError(null);
                  setPreferencesSuccess(null);
                  setAppearance((prev) => ({ ...prev, theme }));
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  void handlePreferencesSave("appearance");
                }}
                isSaving={savePreferencesMutation.isPending}
                isDirty={isAppearanceDirty}
                errorMessage={preferencesError}
                successMessage={preferencesSuccess}
              />
            ) : null}

            {activeTab === "reading" ? (
              <ReadingSettingsSection
                reading={reading}
                onModeChange={(mode) => {
                  setPreferencesError(null);
                  setPreferencesSuccess(null);
                  syncAppearanceWithReading({ ...reading, mode });
                }}
                onToggleTranslation={() => {
                  setPreferencesError(null);
                  setPreferencesSuccess(null);
                  setReading((prev) => ({ ...prev, showTranslation: !prev.showTranslation }));
                }}
                onToggleTransliteration={() => {
                  setPreferencesError(null);
                  setPreferencesSuccess(null);
                  setReading((prev) => ({ ...prev, showTransliteration: !prev.showTransliteration }));
                }}
                onArabicSizeChange={(value) => {
                  setPreferencesError(null);
                  setPreferencesSuccess(null);
                  syncAppearanceWithReading({ ...reading, arabicSize: value });
                }}
                onSubmit={(event) => {
                  event.preventDefault();
                  void handlePreferencesSave("reading");
                }}
                isSaving={savePreferencesMutation.isPending}
                isDirty={isReadingDirty}
                errorMessage={preferencesError}
                successMessage={preferencesSuccess}
              />
            ) : null}

            {activeTab === "security" ? (
              <SecuritySettingsSection
                email={account.email}
                emailVerified={account.emailVerified}
                sessions={data.security.sessions}
                onSendPasswordReset={() => void handlePasswordReset()}
                onLogoutAll={() => void handleLogoutAll()}
                isSendingPasswordReset={isSendingPasswordReset}
                isLoggingOutAll={logoutAllSessionsMutation.isPending}
                passwordResetMessage={passwordResetMessage}
                errorMessage={securityError}
              />
            ) : null}

            {activeTab === "billing" ? <BillingSettingsSection billing={data.billing} /> : null}
          </div>
        </div>
      </div>

      <LoadingPopup
        show={deleteAccountMutation.isPending || logoutAllSessionsMutation.isPending}
        message={deleteAccountMutation.isPending ? "Deleting account..." : "Signing out all sessions..."}
      />
    </>
  );
}
