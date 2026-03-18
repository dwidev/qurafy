"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getKhatamErrorMessage,
  isUnauthorizedKhatamError,
  useCreateKhatamPlanMutation,
  useDeleteKhatamPlanMutation,
  useKhatamMeQuery,
  useRecreateKhatamPlanMutation,
  useToggleKhatamDayMutation,
  useUpdateKhatamPlanMutation,
} from "@/features/tracker/api/client";
import {
  DeletedPlanHistoryPanel,
  EditModal,
  SetupModal,
  TrackerErrorState,
  TrackerEmptyMainState,
  TrackerLoadingState,
  TrackerPageHeader,
  TrackerPlanView,
  WelcomeState,
} from "@/features/tracker/components/TrackerPageSections";

export default function TrackerPage() {
  const router = useRouter();
  const khatamQuery = useKhatamMeQuery();
  const createPlanMutation = useCreateKhatamPlanMutation();
  const updatePlanMutation = useUpdateKhatamPlanMutation();
  const deletePlanMutation = useDeleteKhatamPlanMutation();
  const recreatePlanMutation = useRecreateKhatamPlanMutation();
  const toggleDayMutation = useToggleKhatamDayMutation();
  const [showSetup, setShowSetup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const plan = khatamQuery.data?.activePlan ?? null;
  const deletedPlanHistory = khatamQuery.data?.deletedPlanHistory ?? [];
  const hasHistory = deletedPlanHistory.length > 0;

  useEffect(() => {
    if (khatamQuery.error && isUnauthorizedKhatamError(khatamQuery.error)) {
      router.replace("/login");
    }
  }, [khatamQuery.error, router]);

  const handleCreatePlan = useCallback(
    async (payload: { name: string; startJuz: number; targetDate: string }) => {
      await createPlanMutation.mutateAsync(payload);
      setShowSetup(false);
      setShowEdit(false);
    },
    [createPlanMutation],
  );

  const handleUpdatePlan = useCallback(
    async (payload: { planId: string; name: string; targetDate: string }) => {
      await updatePlanMutation.mutateAsync(payload);
      setShowEdit(false);
    },
    [updatePlanMutation],
  );

  const handleDeletePlan = useCallback(
    async (payload: { planId: string }) => {
      await deletePlanMutation.mutateAsync(payload);
      setShowEdit(false);
    },
    [deletePlanMutation],
  );

  const handleRecreatePlan = useCallback(
    async (historyId: string) => {
      await recreatePlanMutation.mutateAsync({ historyId });
      await khatamQuery.refetch();
    },
    [khatamQuery, recreatePlanMutation],
  );

  const toggleToday = useCallback(async () => {
    if (!plan) {
      return;
    }

    await toggleDayMutation.mutateAsync({ planId: plan.id });
  }, [plan, toggleDayMutation]);

  if (khatamQuery.isError) {
    return (
      <TrackerErrorState message={getKhatamErrorMessage(khatamQuery.error)} onRetry={() => khatamQuery.refetch()} />
    );
  }

  if (khatamQuery.isLoading || !khatamQuery.data) {
    return <TrackerLoadingState />;
  }

  return (
    <div className="mx-auto flex-1 max-w-5xl space-y-8 p-4 pb-24 pt-6 md:p-8">
      <div className="space-y-8">
        {!plan && !hasHistory ? (
          <>
            <TrackerPageHeader
              plan={null}
              onOpenEdit={() => setShowEdit(true)}
              onOpenCreate={() => setShowSetup(true)}
            />
            <WelcomeState onOpenSetup={() => setShowSetup(true)} />
          </>
        ) : !plan ? (
          <>
            <TrackerPageHeader
              plan={null}
              onOpenEdit={() => setShowEdit(true)}
              onOpenCreate={() => setShowSetup(true)}
            />
            <TrackerEmptyMainState />
          </>
        ) : (
          <TrackerPlanView
            plan={plan}
            onOpenEdit={() => setShowEdit(true)}
            onToggleToday={toggleToday}
            isToggling={toggleDayMutation.isPending}
          />
        )}

        {hasHistory ? (
          <DeletedPlanHistoryPanel
            historyItems={deletedPlanHistory}
            onRecreatePlan={handleRecreatePlan}
            recreateHistoryId={recreatePlanMutation.variables?.historyId ?? null}
            isRecreating={recreatePlanMutation.isPending}
          />
        ) : null}
      </div>

      {showSetup ? (
        <SetupModal
          onSave={handleCreatePlan}
          onClose={() => setShowSetup(false)}
          isSubmitting={createPlanMutation.isPending}
        />
      ) : null}

      {showEdit && plan ? (
        <EditModal
          plan={plan}
          onSave={handleUpdatePlan}
          onClose={() => setShowEdit(false)}
          onReset={handleDeletePlan}
        />
      ) : null}
    </div>
  );
}
