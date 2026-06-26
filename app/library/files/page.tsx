import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
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

export default async function LibraryFilesPage() {
  const { data, error } = await supabase
    .from("record_files")
    .select(
      "id, file_name, file_description, document_type, evidence_category, record_type, record_id, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at"
    )
    .order("created_at", { ascending: false });

  const files = (data ?? []) as FileRecord[];

  return (
    <AppShell title="File Index" eyebrow="Library">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Library / File Index
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          File &amp; Evidence Index
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
          All file references, evidence URLs, and document links registered
          across all record types. This index does not upload files — it
          registers references to existing documents, storage locations, and
          external sources.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/library"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Library
          </Link>
          <Link
            href="/library/evidence"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Evidence Archive
          </Link>
          <Link
            href="/reports/evidence-files"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Evidence Report
          </Link>
        </div>
      </section>

      {/* ── Index Table ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              All File References
            </h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {files.length} {files.length === 1 ? "reference" : "references"}{" "}
              registered
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : files.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No file references yet
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              File and evidence references will appear here as they are added to
              hui, marae, whenua, and other records. Use the "Add File
              Reference" button on any record detail page.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[960px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Doc Type</th>
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
                      <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                        Added {formatDate(f.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(f.document_type)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(f.evidence_category)}
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
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {f.review_date ? (
                        <span className="text-[var(--foreground)]">
                          {formatDate(f.review_date)}
                        </span>
                      ) : (
                        "—"
                      )}
                      {f.expiry_date && (
                        <p className="mt-0.5 text-xs text-amber-500">
                          Expires {formatDate(f.expiry_date)}
                        </p>
                      )}
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
        )}
      </section>
    </AppShell>
  );
}
