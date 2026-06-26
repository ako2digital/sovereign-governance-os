import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ReportStatCard from "@/components/reports/ReportStatCard";
import PrintButton from "@/components/reports/PrintButton";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type FileRecord = {
  id: string;
  file_name?: string | null;
  file_description?: string | null;
  document_type?: string | null;
  evidence_category?: string | null;
  record_type?: string | null;
  record_id?: string | null;
  source_url?: string | null;
  public_url?: string | null;
  sensitivity_level?: string | null;
  verification_status?: string | null;
  review_date?: string | null;
  expiry_date?: string | null;
  created_at?: string | null;
};

function countBy<T>(arr: T[], key: keyof T): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of arr) {
    const val = String(item[key] ?? "not set");
    counts[val] = (counts[val] ?? 0) + 1;
  }
  return counts;
}

export default async function EvidenceFilesReportPage() {
  const { data, error } = await supabase
    .from("record_files")
    .select(
      "id, file_name, file_description, document_type, evidence_category, record_type, record_id, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at"
    )
    .order("created_at", { ascending: false });

  const files = (data ?? []) as FileRecord[];

  const today = new Date();
  const in30Days = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
  const in90Days = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);

  const upcomingReviews = files.filter(
    (f) => f.review_date && new Date(f.review_date) <= in90Days
  );
  const upcomingExpiry = files.filter(
    (f) => f.expiry_date && new Date(f.expiry_date) <= in30Days
  );
  const withLinks = files.filter((f) => f.source_url || f.public_url);

  const byDocType = countBy(files, "document_type");
  const byCategory = countBy(files, "evidence_category");
  const bySensitivity = countBy(files, "sensitivity_level");
  const byVerification = countBy(files, "verification_status");

  const generatedAt = new Date().toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell title="Evidence & Files" eyebrow="Reports">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 print:border-none print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Governance Report
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Evidence and Files Report
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Generated {generatedAt}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/reports"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)] print:hidden"
            >
              All Reports
            </Link>
            <Link
              href="/library/evidence"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)] print:hidden"
            >
              Evidence Archive
            </Link>
            <PrintButton />
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Complete audit of file and evidence references across all record
          types — organised by document type, evidence category, sensitivity,
          and verification status. Includes upcoming review and expiry date
          alerts.
        </p>
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          <p className="font-semibold">Database error: {error.message}</p>
        </div>
      )}

      {/* ── Summary Stats ── */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard label="Total File Refs" value={files.length} />
        <ReportStatCard label="With Source Links" value={withLinks.length} subtext="accessible online" />
        <ReportStatCard label="Reviews Due (90d)" value={upcomingReviews.length} subtext="within 90 days" />
        <ReportStatCard label="Expiring (30d)" value={upcomingExpiry.length} subtext="within 30 days" />
      </section>

      {/* ── Alerts ── */}
      {upcomingExpiry.length > 0 && (
        <section className="mt-8 rounded-2xl border border-amber-900 bg-amber-950/20 p-6">
          <h2 className="text-lg font-semibold text-amber-400">
            Expiring Soon — Action Required
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {upcomingExpiry.length}{" "}
            {upcomingExpiry.length === 1 ? "file reference expires" : "file references expire"}{" "}
            within 30 days.
          </p>
          <div className="mt-4 space-y-2">
            {upcomingExpiry.map((f) => (
              <div
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-900 bg-[var(--surface-raised)] px-4 py-3"
              >
                <p className="font-medium text-[var(--foreground)]">
                  {f.file_name || "Unnamed file"}
                </p>
                <p className="text-sm text-amber-400">
                  Expires {formatDate(f.expiry_date)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Breakdown by Document Type ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          By Document Type
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byDocType)
            .sort(([, a], [, b]) => b - a)
            .map(([type, count]) => (
              <div
                key={type}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              >
                <p className="text-sm text-[var(--foreground)]">
                  {type === "not set" ? "No type assigned" : type}
                </p>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--muted-foreground)]">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </section>

      {/* ── Breakdown by Evidence Category ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          By Evidence Category
        </h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byCategory)
            .sort(([, a], [, b]) => b - a)
            .map(([cat, count]) => (
              <div
                key={cat}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              >
                <p className="text-sm text-[var(--foreground)]">
                  {cat === "not set" ? "Uncategorised" : cat}
                </p>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--muted-foreground)]">
                  {count}
                </span>
              </div>
            ))}
        </div>
      </section>

      {/* ── Sensitivity and Verification ── */}
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            By Sensitivity Level
          </h2>
          <div className="mt-4 space-y-2">
            {Object.entries(bySensitivity)
              .sort(([, a], [, b]) => b - a)
              .map(([level, count]) => (
                <div
                  key={level}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                >
                  <p className="text-sm text-[var(--foreground)]">
                    {level === "not set" ? "No level set" : level}
                  </p>
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--muted-foreground)]">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            By Verification Status
          </h2>
          <div className="mt-4 space-y-2">
            {Object.entries(byVerification)
              .sort(([, a], [, b]) => b - a)
              .map(([status, count]) => (
                <div
                  key={status}
                  className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                >
                  <p className="text-sm text-[var(--foreground)]">
                    {status === "not set" ? "No status set" : status}
                  </p>
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--muted-foreground)]">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* ── Full Table ── */}
      {files.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Full File Register
          </h2>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Record</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Verification</th>
                  <th className="px-4 py-3 font-medium">Review</th>
                  <th className="px-4 py-3 font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr
                    key={f.id}
                    className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-[var(--foreground)]">
                        {f.file_name || "Unnamed file"}
                      </p>
                      {f.file_description && (
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {f.file_description}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(f.document_type)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(f.evidence_category)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {f.record_type ? f.record_type.replace(/_/g, " ") : "—"}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(f.sensitivity_level)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(f.verification_status)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {f.review_date ? formatDate(f.review_date) : "—"}
                      {f.expiry_date && (
                        <p className="mt-0.5 text-xs text-amber-500">
                          Exp {formatDate(f.expiry_date)}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {f.source_url || f.public_url ? (
                        <a
                          href={f.source_url ?? f.public_url ?? ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                        >
                          Open
                        </a>
                      ) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {files.length === 0 && !error && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            No file references yet
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Add file references to any record to build the evidence register.
          </p>
        </section>
      )}
    </AppShell>
  );
}
