"use client";

import { useEffect, useState } from "react";

import WorkspaceShell from "@/components/common/WorkspaceShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentActivity from "@/components/dashboard/RecentActivity";
import StatsGrid from "@/components/dashboard/StatsGrid";
import { dashboardService } from "@/services/dashboardService";
import { authService } from "@/services/auth.service";
import type { DashboardMetrics } from "@/types/dashboard";

const defaultMetrics: DashboardMetrics = {
  subjects: 0,
  documents: 0,
  summaries: 0,
  flashcards: 0,
  quizzes: 0,
  chat_messages: 0,
};

export default function DashboardContainer() {
  const [metrics, setMetrics] =
    useState<DashboardMetrics>(defaultMetrics);
  const [userName, setUserName] = useState("Usuario");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getMetrics().catch(() => defaultMetrics),
      authService.getCurrentUser().catch(() => null),
    ]).then(([m, user]) => {
      if (m) setMetrics(m);
      if (user?.name) setUserName(user.name);
      setLoading(false);
    });
  }, []);

  return (
    <WorkspaceShell userName={userName}>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <DashboardHeader userName={userName} />

        {loading ? (
          <p className="text-helper text-center text-sm py-12">
            Cargando dashboard...
          </p>
        ) : (
          <>
            <StatsGrid metrics={metrics} />

            <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <QuickActions />

              <RecentActivity />
            </div>
          </>
        )}
      </div>
    </WorkspaceShell>
  );
}
