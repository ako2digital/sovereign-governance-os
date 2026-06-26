import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue } from "@/lib/utils";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

type TaskRecord = {
  id: string;
  title?: string | null;
  description?: string | null;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  assigned_to_id?: string | null;
  related_hui_id?: string | null;
  related_decision_id?: string | null;
  related_document_id?: string | null;
  created_at?: string | null;
};

type PersonRecord = {
  id: string;
  full_name: string | null;
  role_title?: string | null;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  hui_date?: string | null;
  date?: string | null;
  location?: string | null;
  status?: string | null;
};

type DecisionRecord = {
  id: string;
  title?: string | null;
  decision_text?: string | null;
  status?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
};

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  file_url?: string | null;
  url?: string | null;
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
  verification_status?: string | null;
  review_date?: string | null;
  expiry_date?: string | null;
  created_at?: string | null;
};

const PRIORITY_COLOUR: Record<string, string> = {
  urgent: "text-red-400",
  high: "text-amber-400",
  medium: "text-[var(--foreground)]",
  low: "text-[var(--muted-foreground)]",
};

function StatusPill({ status }: { status?: string | null }) {
  if (!status) return <span className="text-[var(--muted-foreground)]">—</span>;
  const done = ["done", "completed", "closed"].includes(status.toLowerCase());
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        done
          ? "bg-emerald-950/50 text-emerald-400"
          : "bg-[var(--surface-raised)] text-[var(--foreground)]"
      }`}
    >
      {status}
    </span>
  );
}

function isValidUrl(v?: string | null): v is string {
  return typeof v === "string" && /^https?:\/\//.test(v);
}

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;

  const { data: taskData, error: taskError } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const task = taskData as TaskRecord | null;

  const assignedPersonId = task?.assigned_to_id ?? null;
  const linkedHuiId = task?.related_hui_id ?? null;
  const linkedDecisionId = task?.related_decision_id ?? null;
  const linkedDocumentId = task?.related_document_id ?? null;

  const [personResult, huiResult, decisionResult, documentResult, filesResult] =
    await Promise.all([
      assignedPersonId
        ? supabase
            .from("people")
            .select("id, full_name, role_title")
            .eq("id", assignedPersonId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      linkedHuiId
        ? supabase
            .from("hui")
            .select("id, title, hui_date, date, location, status")
            .eq("id", linkedHuiId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      linkedDecisionId
        ? supabase
            .from("decisions")
            .select("id, title, decision_text, status, decision_date, effective_date")
            .eq("id", linkedDecisionId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      linkedDocumentId
        ? supabase
            .from("documents")
            .select("id, title, name, document_type, file_url, url, status")
            .eq("id", linkedDocumentId)
            .maybeSingle()
        : Promise.resolve({ data: null, error: null }),
      supabase
        .from("record_files")
        .select(
          "id, file_name, document_type, evidence_category, source_url, public_url, sensitivity_level, verification_status, review_date, expiry_date, created_at"
        )
        .eq("record_type", "tasks")
        .eq("record_id", id)
        .order("created_at", { ascending: false }),
    ]);

  const assignedPerson = personResult.data as PersonRecord | null;
  const linkedHui = huiResult.data as HuiRecord | null;
  const linkedDecision = decisionResult.data as DecisionRecord | null;
  const linkedDocument = documentResult.data as DocumentRecord | null;
  const files = (filesResult.data ?? []) as FileRow[];

  const taskTitle = task?.title || "Untitled task";

  return (
    <AppShell title="Task Detail" eyebrow="Work & Delivery">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Task Record
        </p>

        {taskError ? (
          <h1 className="mt-2 text-3xl font-semibold text-red-400">Database error</h1>
        ) : !task ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">Task not found</h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No task record exists for this ID.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {taskTitle}
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {task.due_date ? `Due ${formatDate(task.due_date)}` : "No due date set"}
              {task.priority ? (
                <span className={`ml-2 font-medium ${PRIORITY_COLOUR[task.priority] ?? ""}`}>
                  · {task.priority}
                </span>
              ) : null}
            </p>
          </>
        )}

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/tasks"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Tasks
          </Link>
          <Link
            href="/tasks/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Task
          </Link>
          {task && (
            <Link
              href={`/records/tasks/${id}/files/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add File Reference
            </Link>
          )}
          {task && (
            <Link
              href={`/records/tasks/${id}/links/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add Linked Record
            </Link>
          )}
        </div>

        {taskError && (
          <div className="mt-4 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            {taskError.message}
          </div>
        )}
      </section>

      {/* ── Task Details ── */}
      {task && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Task Details</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Status</dt>
              <dd className="mt-1"><StatusPill status={task.status} /></dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Priority</dt>
              <dd className={`mt-1 text-sm font-medium ${PRIORITY_COLOUR[task.priority ?? ""] ?? "text-[var(--foreground)]"}`}>
                {formatValue(task.priority)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Due Date</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(task.due_date)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Created</dt>
              <dd className="mt-1 text-sm text-[var(--foreground)]">{formatDate(task.created_at)}</dd>
            </div>
            {assignedPerson && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Assigned To</dt>
                <dd className="mt-1">
                  <Link
                    href={`/people/${assignedPerson.id}`}
                    className="text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
                  >
                    {assignedPerson.full_name || "Unknown person"}
                  </Link>
                  {assignedPerson.role_title && (
                    <span className="ml-2 text-xs text-[var(--muted-foreground)]">{assignedPerson.role_title}</span>
                  )}
                </dd>
              </div>
            )}
            {task.description && (
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Description</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{task.description}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* ── Governance Chain ── */}
      {(linkedDecision || linkedHui || linkedDocument) && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Governance Chain</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Records this task is linked to through the governance chain.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {linkedDecision && (
              <Link
                href={`/decisions/${linkedDecision.id}`}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Decision</p>
                <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                  {linkedDecision.title || "Untitled decision"}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {formatDate(linkedDecision.decision_date || linkedDecision.effective_date)}
                  {linkedDecision.status ? ` · ${linkedDecision.status}` : ""}
                </p>
              </Link>
            )}
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
                  {linkedHui.location ? ` · ${linkedHui.location}` : ""}
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

      {/* ── File References ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">File References</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {files.length} {files.length === 1 ? "file" : "files"} attached to this task
            </p>
          </div>
          {task && (
            <Link
              href={`/records/tasks/${id}/files/new`}
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
            No file references attached yet. Add evidence, documents, or external URLs to support this task.
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
