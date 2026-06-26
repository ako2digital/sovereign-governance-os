import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ReportStatCard from "@/components/reports/ReportStatCard";
import PrintButton from "@/components/reports/PrintButton";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  status?: string | null;
  sensitivity_level?: string | null;
  file_url?: string | null;
  url?: string | null;
  storage_path?: string | null;
  description?: string | null;
  summary?: string | null;
  created_at?: string | null;
};

type FileRecord = {
  id: string;
  file_name?: string | null;
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

export default async function DocumentRegisterPage() {
  const [documentsResult, filesResult] = await Promise.all([
    supabase
      .from("documents")
      .select("id, title, name, document_type, status, sensitivity_level, file_url, url, storage_path, description, summary, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, record_type, record_id, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at")
      .order("created_at", { ascending: false }),
  ]);

  const documents = (documentsResult.data ?? []) as DocumentRecord[];
  const files = (filesResult.data ?? []) as FileRecord[];

  const generatedAt = new Date().toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <AppShell title="Document Register" eyebrow="Reports">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 print:border-none print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Governance Report
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Document Register
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
            <PrintButton />
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Printable register of all documents and file references — including
          type, status, sensitivity, review dates, and expiry. This register is
          suitable for auditor review, funder due diligence, and governance
          records management.
        </p>
      </section>

      {/* ── Stats ── */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard label="Documents" value={documents.length} subtext="formal documents" />
        <ReportStatCard label="File References" value={files.length} subtext="evidence &amp; file refs" />
        <ReportStatCard label="Total Entries" value={documents.length + files.length} />
        <ReportStatCard
          label="With Links"
          value={
            documents.filter((d) => d.file_url || d.url || d.storage_path).length +
            files.filter((f) => f.source_url || f.public_url).length
          }
          subtext="accessible online"
        />
      </section>

      {/* ── Documents Table ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Documents
          </h2>
          <Link
            href="/documents/new"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)] print:hidden"
          >
            Add Document
          </Link>
        </div>

        {documentsResult.error ? (
          <p className="mt-4 text-sm text-red-400">{documentsResult.error.message}</p>
        ) : documents.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            No documents registered yet.
          </p>
        ) : (
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Link</th>
                  <th className="px-4 py-3 font-medium">Added</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => {
                  const link = doc.file_url ?? doc.url ?? doc.storage_path ?? null;
                  return (
                    <tr
                      key={doc.id}
                      className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={`/documents/${doc.id}`}
                          className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                        >
                          {doc.title || doc.name || "Untitled document"}
                        </Link>
                        {(doc.description || doc.summary) && (
                          <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-[var(--muted-foreground)]">
                            {doc.description || doc.summary}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(doc.document_type)}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(doc.status)}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(doc.sensitivity_level)}
                      </td>
                      <td className="px-4 py-4">
                        {link ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                          >
                            Open
                          </a>
                        ) : "—"}
                      </td>
                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatDate(doc.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── File References Table ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            File and Evidence References
          </h2>
          <Link
            href="/library/files"
            className="text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline print:hidden"
          >
            Full index →
          </Link>
        </div>

        {filesResult.error ? (
          <p className="mt-4 text-sm text-red-400">{filesResult.error.message}</p>
        ) : files.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            No file references registered yet.
          </p>
        ) : (
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
                  <th className="px-4 py-3 font-medium">Expiry</th>
                  <th className="px-4 py-3 font-medium">Link</th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr
                    key={f.id}
                    className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4 font-medium text-[var(--foreground)]">
                      {f.file_name || "Unnamed file"}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(f.document_type)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(f.evidence_category)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {f.record_type ? f.record_type.replace(/_/g, " ") : "—"}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(f.sensitivity_level)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatValue(f.verification_status)}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {f.review_date ? formatDate(f.review_date) : "—"}
                    </td>
                    <td className="px-4 py-4">
                      {f.expiry_date ? (
                        <span className="text-amber-400">
                          {formatDate(f.expiry_date)}
                        </span>
                      ) : "—"}
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
        )}
      </section>
    </AppShell>
  );
}
