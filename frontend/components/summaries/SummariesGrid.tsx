import SummariesEmptyState from "@/components/summaries/SummariesEmptyState";
import SummaryCard from "@/components/summaries/SummaryCard";
import type { StudySummary } from "@/types/summary";

interface SummariesGridProps {
  summaries: StudySummary[];
  hasFilters: boolean;
  onClearFilters: () => void;
  onGenerate: () => void;
}

export default function SummariesGrid({
  summaries,
  hasFilters,
  onClearFilters,
  onGenerate,
}: SummariesGridProps) {
  if (summaries.length === 0) {
    return (
      <SummariesEmptyState
        hasFilters={hasFilters}
        onClearFilters={onClearFilters}
        onGenerate={onGenerate}
      />
    );
  }

  return (
    <section
      aria-label="Listado de resúmenes"
      className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3"
    >
      {summaries.map((summary) => (
        <SummaryCard
          key={summary.id}
          summary={summary}
        />
      ))}
    </section>
  );
}