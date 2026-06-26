import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type WhenuaDetailPageProps = {
  params: Promise<{ id: string }>;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  legal_description: string | null;
  external_reference: string | null;
  historical_notes: string | null;
  status: string | null;
  sensitivity_level: string | null;
  created_at: string | null;
};

type GovernanceRecord = {
  id: string;
  title: string | null;
  record_type: string | null;
  status: string | null;
  effective_date: string | null;
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

export default async function WhenuaDetailPage({ params }: WhenuaDetailPageProps) {
  const { id } = await params;

  const [whenuaResult, governanceResult, filesResult] = await Promise.all([
    supabase
      .from("whenua_records")
      .select("id, title, block_name, location, legal_description, external_reference, historical_notes, status, sensitivity_level, created_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("governance_records")
      .select("id, title, record_type, status, effective_date")
      .eq("related_whenua_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at")
      .eq("record_type", "whenua")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const whenua = whenuaResult.data as WhenuaRecord | null;
  const linkedGovernance = (governanceResult.data ?? []) as GovernanceRecord[];
  const files = (filesResult.data ?? []) as FileRow[];
  const whenuaTitle = whenua?.title || "Untitled whenua record";

  return (
    <AppShell title="Whenua Detail" eyebrow="Whenua & Marae">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Whenua Record
        </p>

        {whenuaResult.error ? (
          <h1 className="mt-2 text-3xl font-semibold text-red-400">Database error</h1>
        ) : !whenua ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Whenua record not found</h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No whenua record exists for this ID. Return to the whenua register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {whenuaTitle}
            </h1>
            {whenua.block_name && (
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {whenua.block_name}
                {whenua.location ? ` · ${whenua.location}` : ""}
              </p>
            )}
          </>
        )}

        {whenuaResult.error && (
          <div className="mt-4 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            {whenuaResult.error.message}
          </div>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/whenua"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Whenua
          </Link>
          <Link
            href="/whenua/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Whenua
          </Link>
          {whenua && (
            <Link
              href={`/records/whenua/${id}/files/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add File Reference
            </Link>
          )}
          {whenua && (
            <Link
              href={`/records/whenua/${id}/links/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add Linked Record
            </Link>
          )}
        </div>
      </section>

      {/* ── Whenua Details ── */}
      {whenua && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Whenua Details</h2>
          <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                {[
                  ["Block Name", formatValue(whenua.block_name)],
                  ["Location", formatValue(whenua.location)],
                  ["Status", formatValue(whenua.status)],
                  ["Sensitivity Level", formatValue(whenua.sensitivity_level)],
                  ["Created", formatDate(whenua.created_at)],
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
                {whenua.legal_description && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Legal Description
                    </th>
                    <td className="px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap">
                      {whenua.legal_description}
                    </td>
                  </tr>
                )}
                {whenua.historical_notes && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      Historical Notes
                    </th>
                    <td className="px-4 py-3.5 text-sm leading-6 text-[var(--foreground)] whitespace-pre-wrap">
                      {whenua.historical_notes}
                    </td>
                  </tr>
                )}
                {whenua.external_reference && (
                  <tr className="border-t border-[var(--border)] bg-[var(--surface-raised)]">
                    <th className="w-48 px-4 py-3.5 align-top text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                      External Reference
                    </th>
                    <td className="px-4 py-3.5 text-sm text-[var(--foreground)]">
                      {isValidUrl(whenua.external_reference) ? (
                        <a
                          href={whenua.external_reference}
                          target="_blank"
                          rel="noreferrer"
                          className="underline-offset-4 hover:underline"
                        >
                          {whenua.external_reference}
                        </a>
                      ) : (
                        whenua.external_reference
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Linked Governance Records ── */}
      {governanceResult.error ? (
        <section className="mt-8 rounded-2xl border border-red-900 bg-red-950/20 p-6">
          <h2 className="text-sm font-semibold text-red-400">Governance link error</h2>
          <pre className="mt-2 text-xs text-red-400">{governanceResult.error.message}</pre>
        </section>
      ) : linkedGovernance.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Linked Governance Records</h2>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                {linkedGovernance.length} governance {linkedGovernance.length === 1 ? "record" : "records"} linked to this whenua
              </p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {linkedGovernance.map((rec) => (
              <Link
                key={rec.id}
                href={`/governance/${rec.id}`}
                className="flex items-start justify-between gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 transition hover:border-[var(--accent)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {rec.title || "Untitled governance record"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {formatValue(rec.record_type)}
                    {rec.status ? ` · ${rec.status}` : ""}
                    {rec.effective_date ? ` · ${formatDate(rec.effective_date)}` : ""}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-[var(--muted-foreground)]">Open →</span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── File References ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">File References</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {files.length} {files.length === 1 ? "file" : "files"} attached to this whenua record
            </p>
          </div>
          {whenua && (
            <Link
              href={`/records/whenua/${id}/files/new`}
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
            No file references attached yet. Add survey documents, title records, maps, or other evidence.
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
