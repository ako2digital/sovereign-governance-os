import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type PanuiDetailPageProps = {
  params: Promise<{ id: string }>;
};

type PanuiRecord = {
  id: string;
  title?: string | null;
  message?: string | null;
  content?: string | null;
  body?: string | null;
  summary?: string | null;
  status?: string | null;
  publish_date?: string | null;
  published_at?: string | null;
  date?: string | null;
  related_hui_id?: string | null;
  related_document_id?: string | null;
  created_at?: string | null;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  status?: string | null;
};

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  file_url?: string | null;
  status?: string | null;
};

type FileRow = {
  id: string;
  file_name?: string | null;
  document_type?: string | null;
  evidence_category?: string | null;
  source_url?: string | null;
  public_url?: string | null;
  sensitivity_level?: string | null;
  review_date?: string | null;
  expiry_date?: string | null;
  created_at?: string | null;
};

function isValidUrl(v?: string | null): v is string {
  return typeof v === "string" && /^https?:\/\//.test(v);
}

function getPanuiTitle(r: PanuiRecord) {
  return r.title || "Untitled pānui record";
}

function getPanuiDate(r: PanuiRecord) {
  return r.published_at || r.publish_date || r.date || null;
}

function getPanuiBody(r: PanuiRecord) {
  return r.message || r.content || r.body || null;
}

export default async function PanuiDetailPage({ params }: PanuiDetailPageProps) {
  const { id } = await params;

  const { data: panuiData, error: panuiError } = await supabase
    .from("panui")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const panui = panuiData as PanuiRecord | null;
  const linkedHuiId = panui?.related_hui_id ?? null;
  const linkedDocumentId = panui?.related_document_id ?? null;

  const [huiResult, documentResult, filesResult] = await Promise.all([
    linkedHuiId
      ? supabase.from("hui").select("id, title, hui_date, date, location, status").eq("id", linkedHuiId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    linkedDocumentId
      ? supabase.from("documents").select("id, title, name, document_type, file_url, status").eq("id", linkedDocumentId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, source_url, public_url, sensitivity_level, review_date, expiry_date, created_at")
      .eq("record_type", "panui")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const linkedHui = huiResult.data as HuiRecord | null;
  const linkedDocument = documentResult.data as DocumentRecord | null;
  const files = (filesResult.data ?? []) as FileRow[];

  const panuiTitle = panui ? getPanuiTitle(panui) : "Untitled pānui record";
  const panuiDate = panui ? getPanuiDate(panui) : null;
  const panuiBody = panui ? getPanuiBody(panui) : null;
  const linkedHuiTitle = linkedHui?.title || "Untitled hui record";
  const linkedHuiDate = linkedHui?.hui_date || linkedHui?.date || null;
  const linkedDocumentTitle = linkedDocument?.title || linkedDocument?.name || "Untitled document";
  const docFileUrl = linkedDocument?.file_url ?? null;

  return (
    <AppShell title="Pānui Detail" eyebrow="Marae">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Pānui Record
        </p>

        {panuiError ? (
          <h1 className="mt-2 text-3xl font-semibold text-red-400">Database error</h1>
        ) : !panui ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Pānui not found</h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No pānui record exists for this ID.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {panuiTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {panuiDate ? `Published ${formatDate(panuiDate)}` : "No publish date"}
              {panui.status ? ` · ${panui.status}` : ""}
            </p>
          </>
        )}

        {panuiError && (
          <div className="mt-4 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            {panuiError.message}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/panui"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Pānui
          </Link>
          <Link
            href="/panui/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Pānui
          </Link>
          {panui && (
            <Link
              href={`/records/panui/${id}/files/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add File Reference
            </Link>
          )}
          {panui && (
            <Link
              href={`/records/panui/${id}/links/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add Linked Record
            </Link>
          )}
        </div>
      </section>

      {/* ── Pānui Content ── */}
      {panui && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Pānui Details</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Status</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatValue(panui.status)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Published</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(panuiDate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Created</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(panui.created_at)}</dd>
            </div>
            {panui.summary && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Summary</dt>
                <dd className="mt-1 text-sm leading-6 text-[var(--foreground)]">{panui.summary}</dd>
              </div>
            )}
            {panuiBody && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Message</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{panuiBody}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* ── Linked Records ── */}
      {(linkedHui || linkedDocument) && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Linked Records</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
            {linkedDocument && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Document</p>
                <Link
                  href={`/documents/${linkedDocument.id}`}
                  className="mt-1 block text-sm font-semibold text-[var(--foreground)] underline-offset-4 hover:underline"
                >
                  {linkedDocumentTitle}
                </Link>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatValue(linkedDocument.document_type)}
                  {linkedDocument.status ? ` · ${linkedDocument.status}` : ""}
                </p>
                {isValidUrl(docFileUrl) && (
                  <a
                    href={docFileUrl as string}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block text-xs font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                  >
                    Open file →
                  </a>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── File References ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">File References</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {files.length} {files.length === 1 ? "file" : "files"} attached to this pānui
            </p>
          </div>
          {panui && (
            <Link
              href={`/records/panui/${id}/files/new`}
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
            No file references attached yet.
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
                  </p>
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

      {/* ── Error blocks ── */}
      {(huiResult.error || documentResult.error) && (
        <section className="mt-8 rounded-2xl border border-red-900 bg-red-950/20 p-6">
          <h2 className="text-sm font-semibold text-red-400">Linked record errors</h2>
          {huiResult.error && <pre className="mt-2 text-xs text-red-400">{huiResult.error.message}</pre>}
          {documentResult.error && <pre className="mt-1 text-xs text-red-400">{documentResult.error.message}</pre>}
        </section>
      )}
    </AppShell>
  );
}
