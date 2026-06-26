import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type DecisionsDetailPageProps = {
  params: Promise<{ id: string }>;
};

type DecisionRecord = {
  id: string;
  title?: string | null;
  decision?: string | null;
  decision_text?: string | null;
  description?: string | null;
  summary?: string | null;
  status?: string | null;
  date?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
  hui_id?: string | null;
  related_hui_id?: string | null;
  minutes_id?: string | null;
  related_minutes_id?: string | null;
  document_id?: string | null;
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

type MinutesRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  minutes_date?: string | null;
  summary?: string | null;
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

type TaskRow = {
  id: string;
  title?: string | null;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  assigned_to_id?: string | null;
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

export default async function DecisionsDetailPage({ params }: DecisionsDetailPageProps) {
  const { id } = await params;

  const [decisionResult, tasksResult, filesResult] = await Promise.all([
    supabase.from("decisions").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("tasks")
      .select("id, title, status, priority, due_date, assigned_to_id")
      .eq("related_decision_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, evidence_category, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at")
      .eq("record_type", "decisions")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const decision = decisionResult.data as DecisionRecord | null;
  const tasks = (tasksResult.data ?? []) as TaskRow[];
  const files = (filesResult.data ?? []) as FileRow[];

  const linkedHuiId = decision?.hui_id || decision?.related_hui_id || null;
  const linkedMinutesId = decision?.minutes_id || decision?.related_minutes_id || null;
  const linkedDocumentId = decision?.document_id || decision?.related_document_id || null;

  const [huiResult, minutesResult, documentResult] = await Promise.all([
    linkedHuiId
      ? supabase.from("hui").select("id, title, hui_date, date, location, status").eq("id", linkedHuiId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    linkedMinutesId
      ? supabase.from("minutes").select("id, title, minutes_date, date, summary, status").eq("id", linkedMinutesId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    linkedDocumentId
      ? supabase.from("documents").select("id, title, name, document_type, file_url, status").eq("id", linkedDocumentId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
  ]);

  const linkedHui = huiResult.data as HuiRecord | null;
  const linkedMinutes = minutesResult.data as MinutesRecord | null;
  const linkedDocument = documentResult.data as DocumentRecord | null;

  const decisionTitle = decision?.title || "Untitled decision record";
  const decisionBody = decision?.decision || decision?.decision_text || decision?.description;
  const decisionDate = decision?.decision_date || decision?.effective_date || decision?.date;

  const priorityColour: Record<string, string> = {
    urgent: "text-red-400",
    high: "text-amber-400",
    medium: "text-[var(--foreground)]",
    low: "text-[var(--muted-foreground)]",
  };

  return (
    <AppShell title="Decision Detail" eyebrow="Decisions">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Decision Record
        </p>

        {decisionResult.error ? (
          <h1 className="mt-2 text-3xl font-semibold text-red-400">Database error</h1>
        ) : !decision ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Decision record not found</h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">No decision record exists for this ID.</p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {decisionTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {decisionDate ? formatDate(decisionDate) : "No date recorded"}
              {decision.status ? ` · ${decision.status}` : ""}
            </p>
          </>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/decisions"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Decisions
          </Link>
          <Link
            href="/decisions/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Decision
          </Link>
          {decision && (
            <>
              <Link
                href="/tasks/new"
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              >
                Create Task from this Decision
              </Link>
              <Link
                href={`/records/decisions/${id}/files/new`}
                className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
              >
                Add File Reference
              </Link>
            </>
          )}
        </div>
      </section>

      {decisionResult.error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          <p className="font-semibold">{decisionResult.error.message}</p>
        </div>
      )}

      {/* ── Decision Details ── */}
      {decision && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Decision Details</h2>

          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Decision Date</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(decisionDate)}</dd>
            </div>
            {decision.effective_date && decision.decision_date !== decision.effective_date && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Effective Date</dt>
                <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(decision.effective_date)}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Status</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatValue(decision.status)}</dd>
            </div>
            {decisionBody && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Decision Text</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{decisionBody}</dd>
              </div>
            )}
            {decision.summary && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Summary</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--muted-foreground)]">{decision.summary}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* ── Source Records ── */}
      {(linkedHui || linkedMinutes || linkedDocument) && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Source Records</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Records this decision was made from.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {linkedHui && (
              <Link
                href={`/hui/${linkedHui.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Hui</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {linkedHui.title || "Untitled hui"}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatDate(linkedHui.hui_date || linkedHui.date)}
                  {linkedHui.status ? ` · ${linkedHui.status}` : ""}
                </p>
              </Link>
            )}
            {linkedMinutes && (
              <Link
                href={`/minutes/${linkedMinutes.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Minutes</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {linkedMinutes.title || "Untitled minutes"}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatDate(linkedMinutes.minutes_date || linkedMinutes.date)}
                  {linkedMinutes.status ? ` · ${linkedMinutes.status}` : ""}
                </p>
              </Link>
            )}
            {linkedDocument && (
              <Link
                href={`/documents/${linkedDocument.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Document</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {linkedDocument.title || linkedDocument.name || "Untitled document"}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatValue(linkedDocument.document_type)}
                  {linkedDocument.status ? ` · ${linkedDocument.status}` : ""}
                </p>
              </Link>
            )}
          </div>
        </section>
      )}

      {/* ── Tasks from this Decision ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Tasks from this Decision</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"} linked to this decision
            </p>
          </div>
          <Link
            href="/tasks/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Create Task
          </Link>
        </div>

        {tasksResult.error && (
          <p className="mt-4 text-sm text-red-400">{tasksResult.error.message}</p>
        )}

        {tasks.length === 0 && !tasksResult.error ? (
          <p className="mt-4 text-sm text-[var(--muted-foreground)]">
            No tasks linked to this decision yet. Create a task and select this decision under "Linked Decision" to close the governance chain.
          </p>
        ) : (
          <div className="mt-5 space-y-2">
            {tasks.map((t) => (
              <Link
                key={t.id}
                href={`/tasks/${t.id}`}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 transition hover:border-[var(--accent)]"
              >
                <div>
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {t.title || "Untitled task"}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                    {t.status ?? "—"}
                    {t.priority ? (
                      <span className={`ml-2 ${priorityColour[t.priority] ?? ""}`}>
                        {t.priority}
                      </span>
                    ) : null}
                    {t.due_date ? ` · Due ${formatDate(t.due_date)}` : ""}
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
              {files.length} {files.length === 1 ? "file" : "files"} attached to this decision
            </p>
          </div>
          {decision && (
            <Link
              href={`/records/decisions/${id}/files/new`}
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
            No file references attached yet. Add evidence, signed documentation, or external URLs to support this decision.
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
