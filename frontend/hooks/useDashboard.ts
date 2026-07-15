"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import { dashboardService } from "@/services/dashboardService";
import type { DashboardMetrics } from "@/types/dashboard";

const defaultMetrics: DashboardMetrics = {
  subjects: 0,
  documents: 0,
  summaries: 0,
  flashcards: 0,
  quizzes: 0,
  chat_messages: 0,
};

export function useDashboard() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getMetrics()
      .then(setMetrics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return { user, metrics, loading };
}
