import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type GovernanceDetailPageProps = {
  params: Promise<{ id: string }>;
};

type GovernanceRecord = {
  id: string;
  title: string | null;
  record_type: string | null;
  summary: string | null;
  status: string | null;
  effective_date: string | null;
  related_marae_id: string | null;
  related_whenua_id: string | null;
  created_at: string | null;
};

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  description?: string | null;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  status: string | null;
  sensitivity_level: string | null;
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

export default async function GovernanceDetailPage({ params }: GovernanceDetailPageProps) {
  const { id } = await params;

  const { data: governanceData, error: governanceError } = await supabase
    .from("governance_records")
    .select("id, title, record_type, summary, status, effective_date, related_marae_id, related_whenua_id, created_at")
    .eq("id", id)
    .maybeSingle();

  const governance = governanceData as GovernanceRecord | null;
  const relatedMaraeId = governance?.related_marae_id ?? null;
  const relatedWhenuaId = governance?.related_whenua_id ?? null;

  const [maraeResult, whenuaResult, filesResult] = await Promise.all([
    relatedMaraeId
      ? supabase.from("marae_records").select("id, name, title, location, description").eq("id", relatedMaraeId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    relatedWhenuaId
      ? supabase.from("whenua_records").select("id, title, block_name, location, status, sensitivity_level").eq("id", relatedWhenuaId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, source_url, public_url, sensitivity_level, review_date, expiry_date, created_at")
      .eq("record_type", "governance")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const linkedMarae = maraeResult.data as MaraeRecord | null;
  const linkedWhenua = whenuaResult.data as WhenuaRecord | null;
  const files = (filesResult.data ?? []) as FileRow[];

  const governanceTitle = governance?.title || "Untitled governance record";
  const linkedMaraeName = linkedMarae?.name || linkedMarae?.title || "Untitled marae record";
  const linkedWhenuaTitle = linkedWhenua?.title || "Untitled whenua record";

  return (
    <AppShell title="Governance Detail" eyebrow="Governance">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Governance Record
        </p>

        {governanceError ? (
          <h1 className="mt-2 text-3xl font-semibold text-red-400">Database error</h1>
        ) : !governance ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Record not found</h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No governance record exists for this ID.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {governanceTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {formatValue(governance.record_type)}
              {governance.status ? ` · ${governance.status}` : ""}
              {governance.effective_date ? ` · Effective ${formatDate(governance.effective_date)}` : ""}
            </p>
          </>
        )}

        {governanceError && (
          <div className="mt-4 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            {governanceError.message}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/governance"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Governance
          </Link>
          <Link
            href="/governance/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Governance
          </Link>
          {governance && (
            <Link
              href={`/records/governance/${id}/files/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add File Reference
            </Link>
          )}
          {governance && (
            <Link
              href={`/records/governance/${id}/links/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add Linked Record
            </Link>
          )}
        </div>
      </section>

      {/* ── Governance Details ── */}
      {governance && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Governance Details</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {[
                  ["Record Type", formatValue(governance.record_type)],
                  ["Status", formatValue(governance.status)],
                  ["Effective Date", formatDate(governance.effective_date)],
                  ["Created", formatDate(governance.created_at)],
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
                {governance.summary && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Summary
                    </th>
                    <td className="px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap">
                      {governance.summary}
                    </td>
                  </tr>
                )}
                {relatedMaraeId && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Linked Marae
                    </th>
                    <td className="px-4 py-3.5 text-sm text-[var(--foreground)]">
                      {linkedMarae ? (
                        <Link href={`/marae/${relatedMaraeId}`} className="underline-offset-4 hover:underline">
                          {linkedMaraeName}
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-[var(--muted-foreground)]">{relatedMaraeId}</span>
                      )}
                    </td>
                  </tr>
                )}
                {relatedWhenuaId && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Linked Whenua
                    </th>
                    <td className="px-4 py-3.5 text-sm text-[var(--foreground)]">
                      {linkedWhenua ? (
                        <Link href={`/whenua/${relatedWhenuaId}`} className="underline-offset-4 hover:underline">
                          {linkedWhenuaTitle}
                          {linkedWhenua.block_name ? ` — ${linkedWhenua.block_name}` : ""}
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-[var(--muted-foreground)]">{relatedWhenuaId}</span>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Linked Records ── */}
      {(linkedMarae || linkedWhenua) && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Linked Records</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
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
          </div>
        </section>
      )}

      {/* ── File References ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">File References</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {files.length} {files.length === 1 ? "file" : "files"} attached to this governance record
            </p>
          </div>
          {governance && (
            <Link
              href={`/records/governance/${id}/files/new`}
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
            No file references attached yet. Add mandates, authority documents, or supporting evidence.
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
    </AppShell>
  );
}
