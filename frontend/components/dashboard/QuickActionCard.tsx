import Link from "next/link";

interface QuickActionCardProps {
  title: string;
  description: string;
  abbreviation: string;
  href: string;
}

export default function QuickActionCard({
  title,
  description,
  abbreviation,
  href,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group flex h-full items-start gap-4 rounded-2xl border border-brand-border bg-brand-card p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-brand-cyan-light hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-cyan-muted transition group-hover:bg-brand-cyan-light">
        <span className="text-brand text-sm">
          {abbreviation}
        </span>
      </div>

      <div>
        <h3 className="text-nav text-sm text-dark-title">
          {title}
        </h3>

        <p className="text-helper mt-1 text-sm">
          {description}
        </p>

        <p className="text-brand mt-3 text-sm">
          Comenzar →
        </p>
      </div>
    </Link>
  );
}