import Link from "next/link";

interface ActivityItemProps {
  title: string;
  description: string;
  date: string;
  abbreviation: string;
  href: string;
}

export default function ActivityItem({
  title,
  description,
  date,
  abbreviation,
  href,
}: ActivityItemProps) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-start gap-4 rounded-xl px-3 py-4 transition hover:bg-brand-bg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-cyan-muted">
          <span className="text-brand text-xs">
            {abbreviation}
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-nav truncate text-sm text-dark-title">
              {title}
            </h3>

            <span className="text-helper shrink-0 text-xs">
              {date}
            </span>
          </div>

          <p className="text-helper mt-1 text-sm">
            {description}
          </p>

          <p className="text-brand mt-2 text-xs opacity-0 transition group-hover:opacity-100">
            Ver actividad →
          </p>
        </div>
      </Link>
    </li>
  );
}