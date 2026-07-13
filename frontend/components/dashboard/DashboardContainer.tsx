import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import type {
  DashboardMetrics,
  DashboardUser,
} from "@/types/dashboard";

const mockUser: DashboardUser = {
  name: "Aarón",
};

const mockMetrics: DashboardMetrics = {
  subjects: 4,
  documents: 12,
  summaries: 7,
  flashcards: 35,
  quizzes: 8,
  chat_messages: 21,
};

export default function DashboardContainer() {
  return (
    <main className="min-h-screen bg-brand-bg">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <DashboardHeader userName={mockUser.name} />

        <StatsGrid metrics={mockMetrics} />
      </div>
    </main>
  );
}