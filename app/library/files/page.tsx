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

type LibraryFilesPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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

const DOC_TYPES = [
  "resolution", "policy", "agreement", "deed", "minutes", "report",
  "certificate", "correspondence", "financial", "plan", "map", "photo",
  "recording", "other",
];
const EVIDENCE_CATS = [
  "governance", "financial", "legal", "land", "operational",
  "historical", "cultural", "environmental", "other",
];
const SENSITIVITY_LEVELS = ["public", "internal", "restricted", "highly sensitive"];
const VERIFICATION_STATUSES = ["unregistered", "pending", "verified", "certified"];
const RECORD_TYPES = [
  "hui", "minutes", "decisions", "tasks", "documents",
  "marae_records", "whenua", "people", "governance_records",
];

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default async function LibraryFilesPage({ searchParams }: LibraryFilesPageProps) {
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const docType = typeof sp.doc_type === "string" ? sp.doc_type.trim() : "";
  const category = typeof sp.category === "string" ? sp.category.trim() : "";
  const sensitivity = typeof sp.sensitivity === "string" ? sp.sensitivity.trim() : "";
  const verification = typeof sp.verification === "string" ? sp.verification.trim() : "";
  const recordType = typeof sp.record_type === "string" ? sp.record_type.trim() : "";

  let query = supabase
    .from("record_files")
    .select(
      "id, file_name, file_description, document_type, evidence_category, record_type, record_id, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at"
    )
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("file_name", `%${q}%`);
  if (docType) query = query.eq("document_type", docType);
  if (category) query = query.eq("evidence_category", category);
  if (sensitivity) query = query.eq("sensitivity_level", sensitivity);
  if (verification) query = query.eq("verification_status", verification);
  if (recordType) query = query.eq("record_type", recordType);

  const { data, error } = await query;

  const files = (data ?? []) as FileRecord[];
  const hasFilters = !!(q || docType || category || sensitivity || verification || recordType);

  return (
    <AppShell title="File Index" eyebrow="Library & Archive">
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

      {/* ── Search & Filter ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
        <h2 className="text-sm font-medium text-[var(--foreground)]">Search &amp; Filter</h2>
        <form method="GET" action="/library/files" className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <label htmlFor="q" className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              File name
            </label>
            <input
              id="q"
              name="q"
              type="text"
              defaultValue={q}
              placeholder="Search by file name…"
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-2.5 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label htmlFor="doc_type" className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Document Type
            </label>
            <select
              id="doc_type"
              name="doc_type"
              defaultValue={docType}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">All types</option>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>{cap(t)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="category" className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Evidence Category
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">All categories</option>
              {EVIDENCE_CATS.map((c) => (
                <option key={c} value={c}>{cap(c)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sensitivity" className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Sensitivity
            </label>
            <select
              id="sensitivity"
              name="sensitivity"
              defaultValue={sensitivity}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">All levels</option>
              {SENSITIVITY_LEVELS.map((s) => (
                <option key={s} value={s}>{cap(s)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="verification" className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Verification
            </label>
            <select
              id="verification"
              name="verification"
              defaultValue={verification}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">All statuses</option>
              {VERIFICATION_STATUSES.map((v) => (
                <option key={v} value={v}>{cap(v)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="record_type" className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Record Type
            </label>
            <select
              id="record_type"
              name="record_type"
              defaultValue={recordType}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">All records</option>
              {RECORD_TYPES.map((r) => (
                <option key={r} value={r}>{cap(r.replace(/_/g, " "))}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Apply Filters
            </button>
            {hasFilters && (
              <Link
                href="/library/files"
                className="rounded-xl border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              >
                Clear Filters
              </Link>
            )}
          </div>
        </form>
      </section>

      {/* ── Index Table ── */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {hasFilters ? "Filtered Results" : "All File References"}
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            {files.length} {files.length === 1 ? "reference" : "references"}{" "}
            {hasFilters ? "matched" : "registered"}
          </p>
        </div>

        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : files.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              {hasFilters ? "No files matched these filters" : "No file references yet"}
            </h3>
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              {hasFilters
                ? "Try adjusting or clearing the filters above."
                : "File and evidence references will appear here as they are added to hui, marae, whenua, and other records."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]">
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
