"use client";

export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)] print:hidden"
    >
      Print / Save as PDF
    </button>
  );
}
