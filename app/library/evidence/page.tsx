import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ReportStatCard from "@/components/reports/ReportStatCard";
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
  expiry_date?: string | null;
  created_at?: string | null;
};

const EVIDENCE_CATEGORIES = [
  { key: "governance", label: "Governance" },
  { key: "financial", label: "Financial" },
  { key: "legal", label: "Legal" },
  { key: "land", label: "Land / Whenua" },
  { key: "operational", label: "Operational" },
  { key: "historical", label: "Historical" },
  { key: "cultural", label: "Cultural" },
  { key: "environmental", label: "Environmental" },
  { key: "other", label: "Other" },
];

function recordLink(recordType: string, recordId: string): string {
  const routes: Record<string, string> = {
    hui: `/hui/${recordId}`,
    marae_records: `/marae/${recordId}`,
    whenua: `/whenua/${recordId}`,
    people: `/people/${recordId}`,
    decisions: `/decisions/${recordId}`,
    minutes: `/minutes/${recordId}`,
    tasks: `/tasks/${recordId}`,
    documents: `/documents/${recordId}`,
    governance_records: `/governance/${recordId}`,
  };
  return routes[recordType] ?? `/${recordType}/${recordId}`;
}

export default async function EvidenceArchivePage() {
  const { data, error } = await supabase
    .from("record_files")
    .select(
      "id, file_name, file_description, document_type, evidence_category, record_type, record_id, source_url, public_url, sensitivity_level, verification_status, expiry_date, created_at"
    )
    .order("evidence_category", { ascending: true });

  const files = (data ?? []) as FileRecord[];

  const byCategory: Record<string, FileRecord[]> = {};
  for (const f of files) {
    const cat = f.evidence_category || "other";
    if (!byCategory[cat]) byCategory[cat] = [];
    byCategory[cat].push(f);
  }

  const uncategorised = files.filter((f) => !f.evidence_category);
  const categorised = files.filter((f) => !!f.evidence_category);
  const withLinks = files.filter((f) => f.source_url || f.public_url);
  const verified = files.filter(
    (f) => f.verification_status && f.verification_status !== "unregistered"
  );

  return (
    <AppShell title="Evidence Archive" eyebrow="Library">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Library / Evidence
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Evidence Archive
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Evidence references organised by category — funding, governance,
          compliance, land, and operational evidence. Evidence Library uses file
          and record references for now. Later this can include generated
          evidence items, outcomes, reports, and funding packs.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/library"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Library
          </Link>
          <Link
            href="/library/files"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Full File Index
          </Link>
          <Link
            href="/reports/funding-readiness"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Funding Readiness Report
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard label="Total Evidence Refs" value={files.length} />
        <ReportStatCard label="Categorised" value={categorised.length} subtext="with evidence category" />
        <ReportStatCard label="With Source Links" value={withLinks.length} subtext="accessible online" />
        <ReportStatCard label="Verified" value={verified.length} subtext="registered or verified" />
      </section>

      {error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          <p className="font-semibold">Database error</p>
          <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
        </div>
      )}

      {files.length === 0 && !error && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            No evidence references yet
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Add file references to records (hui, marae, whenua, decisions) and
            assign an evidence category. References with a category will appear
            here, organised by type.
          </p>
        </section>
      )}

      {/* ── By Category ── */}
      {EVIDENCE_CATEGORIES.map(({ key, label }) => {
        const items = byCategory[key] ?? [];
        if (items.length === 0) return null;

        return (
          <section
            key={key}
            className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                {label}
              </h2>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
                {items.length}
              </span>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                  <tr>
                    <th className="px-4 py-3 font-medium">File</th>
                    <th className="px-4 py-3 font-medium">Doc Type</th>
                    <th className="px-4 py-3 font-medium">Record</th>
                    <th className="px-4 py-3 font-medium">Sensitivity</th>
                    <th className="px-4 py-3 font-medium">Verification</th>
                    <th className="px-4 py-3 font-medium">Link</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((f) => (
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
                        {f.expiry_date && (
                          <p className="mt-0.5 text-xs text-amber-500">
                            Expires {formatDate(f.expiry_date)}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(f.document_type)}
                      </td>
                      <td className="px-4 py-4">
                        {f.record_type && f.record_id ? (
                          <Link
                            href={recordLink(f.record_type, f.record_id)}
                            className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                          >
                            {f.record_type.replace(/_/g, " ")}
                          </Link>
                        ) : (
                          <span className="text-[var(--muted-foreground)]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(f.sensitivity_level)}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(f.verification_status)}
                      </td>
                      <td className="px-4 py-4">
                        {f.source_url || f.public_url ? (
                          <a
                            href={f.source_url ?? f.public_url ?? ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                          >
                            Open
                          </a>
                        ) : (
                          <span className="text-[var(--muted-foreground)]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}

      {/* Uncategorised */}
      {uncategorised.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Uncategorised
            </h2>
            <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
              {uncategorised.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            File references without an evidence category assigned.
          </p>
          <div className="mt-5 space-y-2">
            {uncategorised.map((f) => (
              <div
                key={f.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              >
                <p className="text-sm font-medium text-[var(--foreground)]">
                  {f.file_name || "Unnamed file"}
                </p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {formatValue(f.document_type)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </AppShell>
  );
}
