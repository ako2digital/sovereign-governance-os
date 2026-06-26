import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type DocumentsDetailPageProps = {
  params: Promise<{ id: string }>;
};

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
  summary?: string | null;
  description?: string | null;
  notes?: string | null;
  related_hui_id?: string | null;
  related_whenua_id?: string | null;
  related_marae_id?: string | null;
  created_at?: string | null;
};

type DecisionRecord = {
  id: string;
  title?: string | null;
  status?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
  date?: string | null;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  hui_date?: string | null;
  date?: string | null;
  location?: string | null;
  status?: string | null;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  status: string | null;
};

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  description?: string | null;
};

type FileRow = {
  id: string;
  file_name?: string | null;
  document_type?: string | null;
  evidence_category?: string | null;
  source_url?: string | null;
  public_url?: string | null;
  sensitivity_level?: string | null;
  verification_status?: string | null;
  review_date?: string | null;
  expiry_date?: string | null;
  created_at?: string | null;
};

function isValidUrl(v?: string | null): v is string {
  return typeof v === "string" && /^https?:\/\//.test(v);
}

export default async function DocumentsDetailPage({ params }: DocumentsDetailPageProps) {
  const { id } = await params;

  const { data: documentData, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const document = documentData as DocumentRecord | null;
  const linkedHuiId = document?.related_hui_id ?? null;
  const linkedWhenuaId = document?.related_whenua_id ?? null;
  const linkedMaraeId = document?.related_marae_id ?? null;

  const [decisionsResult, huiResult, whenuaResult, maraeResult, filesResult] = await Promise.all([
    supabase
      .from("decisions")
      .select("id, title, status, decision_date, effective_date, date")
      .or(`document_id.eq.${id},related_document_id.eq.${id}`)
      .order("created_at", { ascending: false }),
    linkedHuiId
      ? supabase.from("hui").select("id, title, hui_date, date, location, status").eq("id", linkedHuiId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    linkedWhenuaId
      ? supabase.from("whenua_records").select("id, title, block_name, location, status").eq("id", linkedWhenuaId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    linkedMaraeId
      ? supabase.from("marae_records").select("id, name, title, location, description").eq("id", linkedMaraeId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at")
      .eq("record_type", "documents")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const linkedDecisions = (decisionsResult.data ?? []) as DecisionRecord[];
  const linkedHui = huiResult.data as HuiRecord | null;
  const linkedWhenua = whenuaResult.data as WhenuaRecord | null;
  const linkedMarae = maraeResult.data as MaraeRecord | null;
  const files = (filesResult.data ?? []) as FileRow[];

  const documentTitle = document?.title || document?.name || "Untitled document record";
  const documentUrl = document?.file_url || document?.url || null;
  const hasDocumentUrl = isValidUrl(documentUrl);
  const linkedHuiTitle = linkedHui?.title || "Untitled hui record";
  const linkedHuiDate = linkedHui?.hui_date || linkedHui?.date || null;
  const linkedWhenuaTitle = linkedWhenua?.title || "Untitled whenua record";
  const linkedMaraeName = linkedMarae?.name || linkedMarae?.title || "Untitled marae record";

  return (
    <AppShell title="Document Detail" eyebrow="Records">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Document Record
        </p>

        {documentError ? (
          <h1 className="mt-2 text-3xl font-semibold text-red-400">Database error</h1>
        ) : !document ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Document not found</h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No document record exists for this ID. Return to the documents register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {documentTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {formatValue(document.document_type)}
              {document.status ? ` · ${document.status}` : ""}
              {document.sensitivity_level ? ` · ${document.sensitivity_level}` : ""}
            </p>
          </>
        )}

        {documentError && (
          <div className="mt-4 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            {documentError.message}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/documents"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Documents
          </Link>
          <Link
            href="/documents/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Document
          </Link>
          {document && (
            <Link
              href={`/records/documents/${id}/files/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add File Reference
            </Link>
          )}
          {document && (
            <Link
              href={`/records/documents/${id}/links/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add Linked Record
            </Link>
          )}
          {hasDocumentUrl && (
            <a
              href={documentUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Open File →
            </a>
          )}
        </div>
      </section>

      {/* ── Document Details ── */}
      {document && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Document Details</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {[
                  ["Document Type", formatValue(document.document_type)],
                  ["Status", formatValue(document.status)],
                  ["Sensitivity Level", formatValue(document.sensitivity_level)],
                  ["Created", formatDate(document.created_at)],
                ].map(([label, value], i) => (
                  <tr
                    key={label}
                    className={`border-t border-[var(--border)] ${i % 2 === 0 ? "bg-[var(--surface-raised)]" : "bg-[var(--surface)]"}`}
                  >
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      {label}
                    </th>
                    <td className="px-4 py-3.5 text-sm text-[var(--foreground)]">{value}</td>
                  </tr>
                ))}
                {document.storage_path && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Storage Path
                    </th>
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">{document.storage_path}</span>
                    </td>
                  </tr>
                )}
                {documentUrl && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      File URL
                    </th>
                    <td className="px-4 py-3.5 text-sm">
                      {hasDocumentUrl ? (
                        <a
                          href={documentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="break-all text-[var(--foreground)] underline-offset-4 hover:underline"
                        >
                          {documentUrl}
                        </a>
                      ) : (
                        <span className="text-[var(--muted-foreground)]">{documentUrl}</span>
                      )}
                    </td>
                  </tr>
                )}
                {document.summary && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Summary
                    </th>
                    <td className="px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap">
                      {document.summary}
                    </td>
                  </tr>
                )}
                {document.description && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Description
                    </th>
                    <td className="px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap">
                      {document.description}
                    </td>
                  </tr>
                )}
                {document.notes && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Notes
                    </th>
                    <td className="px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap">
                      {document.notes}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Linked Records ── */}
      {(linkedHui || linkedWhenua || linkedMarae) && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Linked Records</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {linkedHui && (
              <Link
                href={`/hui/${linkedHui.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Hui</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{linkedHuiTitle}</p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatDate(linkedHuiDate)}
                  {linkedHui.location ? ` · ${linkedHui.location}` : ""}
                </p>
              </Link>
            )}
            {linkedWhenua && (
              <Link
                href={`/whenua/${linkedWhenua.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Whenua</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{linkedWhenuaTitle}</p>
                {linkedWhenua.location && (
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{linkedWhenua.location}</p>
                )}
              </Link>
            )}
            {linkedMarae && (
              <Link
                href={`/marae/${linkedMarae.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Marae</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{linkedMaraeName}</p>
                {linkedMarae.location && (
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">{linkedMarae.location}</p>
                )}
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── Linked Decisions ── */}
      {linkedDecisions.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Linked Decisions</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {linkedDecisions.length} {linkedDecisions.length === 1 ? "decision" : "decisions"} referencing this document
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {linkedDecisions.map((decision) => {
              const decisionDate = decision.decision_date || decision.effective_date || decision.date || null;
              return (
                <Link
                  key={decision.id}
                  href={`/decisions/${decision.id}`}
                  className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 transition hover:border-[var(--accent)]"
                >
                  <div>
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {decision.title || "Untitled decision"}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      {formatDate(decisionDate)}
                      {decision.status ? ` · ${decision.status}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-[var(--muted-foreground)]">Open →</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── File References ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">File References</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {files.length} {files.length === 1 ? "file" : "files"} attached to this document
            </p>
          </div>
          {document && (
            <Link
              href={`/records/documents/${id}/files/new`}
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add File Reference
            </Link>
          )}
        </div>

        {filesResult.error && (
          <p className="mt-4 text-sm text-red-400">{filesResult.error.message}</p>
        )}

        {files.length === 0 && !filesResult.error ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            No file references attached yet. Add evidence files, external URLs, or supporting documents.
          </p>
        ) : (
          <div className="mt-5 space-y-2">
            {files.map((f) => (
              <div
                key={f.id}
                className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {f.file_name || "Unnamed file"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {formatValue(f.document_type)}
                    {f.evidence_category ? ` · ${f.evidence_category}` : ""}
                    {f.sensitivity_level ? ` · ${f.sensitivity_level}` : ""}
                    {f.verification_status ? ` · ${f.verification_status}` : ""}
                  </p>
                  {f.review_date && (
                    <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                      Review: {formatDate(f.review_date)}
                      {f.expiry_date ? ` · Expires: ${formatDate(f.expiry_date)}` : ""}
                    </p>
                  )}
                </div>
                {isValidUrl(f.source_url ?? f.public_url) && (
                  <a
                    href={(f.source_url ?? f.public_url) as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                  >
                    Open →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Errors ── */}
      {(decisionsResult.error || huiResult.error || whenuaResult.error || maraeResult.error) && (
        <section className="mt-8 rounded-2xl border border-red-900 bg-red-950/20 p-6">
          <h2 className="text-sm font-semibold text-red-400">Linked record errors</h2>
          {decisionsResult.error && <pre className="mt-2 text-xs text-red-400">{decisionsResult.error.message}</pre>}
          {huiResult.error && <pre className="mt-1 text-xs text-red-400">{huiResult.error.message}</pre>}
          {whenuaResult.error && <pre className="mt-1 text-xs text-red-400">{whenuaResult.error.message}</pre>}
          {maraeResult.error && <pre className="mt-1 text-xs text-red-400">{maraeResult.error.message}</pre>}
        </section>
      )}
    </AppShell>
  );
}
