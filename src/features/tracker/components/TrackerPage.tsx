"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getKhatamErrorMessage,
  isUnauthorizedKhatamError,
  useCreateKhatamPlanMutation,
  useDeleteKhatamPlanMutation,
  useKhatamMeQuery,
  useToggleKhatamDayMutation,
  useUpdateKhatamPlanMutation,
} from "@/features/tracker/api/client";
import {
  EditModal,
  SetupModal,
  TrackerErrorState,
  TrackerLoadingState,
  TrackerPageHeader,
  TrackerPlanView,
  WelcomeState,
} from "@/features/tracker/components/TrackerPageSections";
import type { KhatamMeData } from "@/features/tracker/types";

export default function TrackerPage({ initialData }: { initialData?: KhatamMeData }) {
  const router = useRouter();
  const khatamQuery = useKhatamMeQuery({ initialData });
  const createPlanMutation = useCreateKhatamPlanMutation();
  const updatePlanMutation = useUpdateKhatamPlanMutation();
  const deletePlanMutation = useDeleteKhatamPlanMutation();
  const toggleDayMutation = useToggleKhatamDayMutation();
  const [showSetup, setShowSetup] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const plan = khatamQuery.data?.activePlan ?? null;

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
      {!plan ? (
        <>
          <TrackerPageHeader plan={null} onOpenEdit={() => setShowEdit(true)} />
          <WelcomeState onOpenSetup={() => setShowSetup(true)} />
        </>
      ) : (
        <TrackerPlanView
          plan={plan}
          onOpenEdit={() => setShowEdit(true)}
          onToggleToday={toggleToday}
          isToggling={toggleDayMutation.isPending}
        />
      )}

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
