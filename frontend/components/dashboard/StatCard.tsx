import Link from "next/link";

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  abbreviation: string;
  href: string;
}

export default function StatCard({
  title,
  value,
  description,
  abbreviation,
  href,
}: StatCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
    >
      <article className="h-full rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm transition duration-200 group-hover:-translate-y-1 group-hover:border-brand-cyan-light group-hover:shadow-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-nav text-sm text-dark-muted">
              {title}
            </p>

            <p className="text-display mt-3 text-3xl">
              {value}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-cyan-muted transition group-hover:bg-brand-cyan-light">
            <span className="text-brand text-sm">
              {abbreviation}
            </span>
          </div>
        </div>

        <p className="text-helper mt-4 text-sm">
          {description}
        </p>

        <p className="text-brand mt-5 text-sm opacity-0 transition group-hover:opacity-100">
          Ver contenido →
        </p>
      </article>
    </Link>
  );
}