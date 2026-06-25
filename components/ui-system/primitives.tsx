// Shared visual primitives for the commercial UI passes (dashboard, registers,
// detail pages, forms). Token-driven only — nothing here hardcodes a theme.

export function Dot({
  muted = false,
  className = "",
}: {
  muted?: boolean;
  className?: string;
}) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full transition-colors ${
        muted ? "bg-[var(--border)]" : "bg-[var(--accent)]"
      } ${className}`}
    />
  );
}

export function StatusBadge({
  children,
  tone = "accent",
}: {
  children: React.ReactNode;
  tone?: "accent" | "muted";
}) {
  if (tone === "muted") {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-3 py-1 text-xs font-medium text-[var(--muted-foreground)]">
        {children}
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-3 py-1 text-xs font-medium text-[var(--accent)]"
      style={{
        backgroundColor: "color-mix(in srgb, var(--accent) 14%, transparent)",
      }}
    >
      {children}
    </span>
  );
}

export const buttonPrimaryClass =
  "rounded-lg bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90";

export const buttonSecondaryClass =
  "rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] dark:hover:bg-white/5";

export const panelClass =
  "rounded-2xl border border-[var(--border)] bg-[var(--surface)]";
