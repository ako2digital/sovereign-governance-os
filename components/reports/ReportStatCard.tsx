type ReportStatCardProps = {
  label: string;
  value: number | string;
  subtext?: string;
};

export default function ReportStatCard({
  label,
  value,
  subtext,
}: ReportStatCardProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-5">
      <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-[var(--foreground)]">
        {value}
      </p>
      {subtext && (
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">{subtext}</p>
      )}
    </div>
  );
}
