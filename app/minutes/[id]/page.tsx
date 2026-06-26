import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type MinutesDetailPageProps = {
  params: Promise<{ id: string }>;
};

type MinutesRecord = {
  id: string;
  title?: string | null;
  hui_id?: string | null;
  related_hui_id?: string | null;
  date?: string | null;
  minutes_date?: string | null;
  summary?: string | null;
  content?: string | null;
  notes?: string | null;
  status?: string | null;
  approved_at?: string | null;
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

type DecisionRow = {
  id: string;
  title?: string | null;
  status?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
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

export default async function MinutesDetailPage({ params }: MinutesDetailPageProps) {
  const { id } = await params;

  const [minutesResult, decisionsResult, filesResult] = await Promise.all([
    supabase.from("minutes").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("decisions")
      .select("id, title, status, decision_date, effective_date")
      .eq("related_minutes_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at")
      .eq("record_type", "minutes")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const minutes = minutesResult.data as MinutesRecord | null;
  const decisions = (decisionsResult.data ?? []) as DecisionRow[];
  const files = (filesResult.data ?? []) as FileRow[];

  const linkedHuiId = minutes?.hui_id || minutes?.related_hui_id || null;

  const huiResult = linkedHuiId
    ? await supabase.from("hui").select("id, title, hui_date, date, location, status").eq("id", linkedHuiId).maybeSingle()
    : { data: null, error: null };

  const linkedHui = huiResult.data as HuiRecord | null;

  const minutesTitle = minutes?.title || "Untitled minutes record";
  const minutesDate = minutes?.minutes_date || minutes?.date || null;
  const linkedHuiTitle = linkedHui?.title || "Untitled hui record";
  const linkedHuiDate = linkedHui?.hui_date || linkedHui?.date || null;

  return (
    <AppShell title="Minutes Detail" eyebrow="Governance">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Minutes Record
        </p>

        {minutesResult.error ? (
          <h1 className="mt-2 text-3xl font-semibold text-red-400">
            Database error
          </h1>
        ) : !minutes ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Minutes record not found
            </h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No minutes record exists for this ID.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {minutesTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {minutesDate ? formatDate(minutesDate) : "No date recorded"}
              {minutes.status ? ` · ${minutes.status}` : ""}
            </p>
          </>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/minutes"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Minutes
          </Link>
          <Link
            href="/minutes/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Minutes
          </Link>
          {minutes && (
            <Link
              href={`/records/minutes/${id}/files/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add File Reference
            </Link>
          )}
        </div>
      </section>

      {minutesResult.error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          <p className="font-semibold">{minutesResult.error.message}</p>
        </div>
      )}

      {/* ── Minutes Details ── */}
      {minutes && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Minutes Details</h2>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Title</dt>
              <dd className="mt-1 text-sm font-medium text-[var(--foreground)]">{minutesTitle}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Date</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(minutesDate)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Status</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatValue(minutes.status)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Approved</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(minutes.approved_at)}</dd>
            </div>
            {minutes.summary && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Summary</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{minutes.summary}</dd>
              </div>
            )}
            {minutes.content && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Minutes Content</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">{minutes.content}</dd>
              </div>
            )}
            {minutes.notes && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Internal Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--muted-foreground)]">{minutes.notes}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* ── Linked Hui ── */}
      {linkedHui && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Linked Hui</h2>
            <Link
              href={`/hui/${linkedHui.id}`}
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Open Hui
            </Link>
          </div>
          <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4">
            <Link
              href={`/hui/${linkedHui.id}`}
              className="font-semibold text-[var(--foreground)] underline-offset-4 hover:underline"
            >
              {linkedHuiTitle}
            </Link>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {formatDate(linkedHuiDate)}
              {linkedHui.location ? ` · ${linkedHui.location}` : ""}
              {linkedHui.status ? ` · ${linkedHui.status}` : ""}
            </p>
          </div>
        </section>
      )}

      {/* ── Decisions from these Minutes ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Decisions from these Minutes</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {decisions.length} {decisions.length === 1 ? "decision" : "decisions"} linked to these minutes
            </p>
          </div>
          <Link
            href="/decisions/new"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Add Decision
          </Link>
        </div>

        {decisionsResult.error && (
          <p className="mt-4 text-sm text-red-400">{decisionsResult.error.message}</p>
        )}

        {decisions.length === 0 && !decisionsResult.error ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            No decisions linked to these minutes yet. When creating a decision, select these minutes under "Related Minutes".
          </p>
        ) : (
          <div className="mt-5 space-y-2">
            {decisions.map((d) => (
              <Link
                key={d.id}
                href={`/decisions/${d.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 transition hover:border-[var(--accent)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {d.title || "Untitled decision"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {formatDate(d.decision_date || d.effective_date)}
                    {d.status ? ` · ${d.status}` : ""}
                  </p>
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">View →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── File References ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">File References</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {files.length} {files.length === 1 ? "file" : "files"} attached to these minutes
            </p>
          </div>
          {minutes && (
            <Link
              href={`/records/minutes/${id}/files/new`}
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
            No file references attached yet. Add evidence, signed copies, or document URLs using the button above.
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
                {(f.source_url || f.public_url) && (
                  <a
                    href={f.source_url ?? f.public_url ?? ""}
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
