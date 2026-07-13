interface StatCardProps {
    title: string;
    value: number;
    description: string;
    abbreviation: string;
  }
  
  export default function StatCard({
    title,
    value,
    description,
    abbreviation,
  }: StatCardProps) {
    return (
      <article className="rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-nav text-sm text-dark-muted">{title}</p>
  
            <p className="text-display mt-3 text-3xl">
              {value}
            </p>
          </div>
  
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan-muted">
            <span className="text-brand text-sm">
              {abbreviation}
            </span>
          </div>
        </div>
  
        <p className="text-helper mt-4 text-sm">
          {description}
        </p>
      </article>
    );
  }