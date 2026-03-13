"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getDashboardErrorMessage,
  isUnauthorizedDashboardError,
  useDashboardMeQuery,
} from "@/features/dashboard/api/client";
import { DashboardPageSkeleton } from "@/features/dashboard/components/DashboardPageSkeleton";
import {
  DashboardPageContent,
  DashboardPageErrorState,
} from "@/features/dashboard/components/DashboardPageSections";
import type { DashboardMeData } from "@/features/dashboard/types";

export function DashboardPage({ initialData }: { initialData?: DashboardMeData }) {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useDashboardMeQuery({ initialData });

  useEffect(() => {
    if (error && isUnauthorizedDashboardError(error)) {
      router.replace("/login");
    }
  }, [error, router]);

  if (isError) {
    return <DashboardPageErrorState message={getDashboardErrorMessage(error)} onRetry={() => refetch()} />;
  }

  if (isLoading || !data) {
    return <DashboardPageSkeleton />;
  }

  return <DashboardPageContent data={data} />;
}
