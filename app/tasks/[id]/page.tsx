import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type TaskDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
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
  created_at?: string | null;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type DecisionRecord = {
  id: string;
  title?: string | null;
  decision?: string | null;
  decision_text?: string | null;
  status?: string | null;
  date?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
  created_at?: string | null;
};

type DocumentRecord = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  file_url?: string | null;
  url?: string | null;
  status?: string | null;
  created_at?: string | null;
};

function formatValue(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
}

function taskPath(id: string) {
  return `/tasks/${id}`;
}

function personPath(id: string) {
  return `/people/${id}`;
}

function huiPath(id: string) {
  return `/hui/${id}`;
}

function decisionPath(id: string) {
  return `/decisions/${id}`;
}

function documentPath(id: string) {
  return `/documents/${id}`;
}

function FieldRow({
  label,
  children,
  darker = false,
}: {
  label: string;
  children: React.ReactNode;
  darker?: boolean;
}) {
  return (
    <tr
      className={`border-t border-stone-800 ${
        darker ? "bg-stone-950" : "bg-stone-900"
      }`}
    >
      <th className="w-56 px-4 py-4 align-top font-medium text-stone-400">
        {label}
      </th>

      <td className="px-4 py-4 text-stone-300">{children}</td>
    </tr>
  );
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

  const { data: personData, error: personError } = assignedPersonId
    ? await supabase
        .from("people")
        .select("id, full_name, created_at")
        .eq("id", assignedPersonId)
        .maybeSingle()
    : { data: null, error: null };

  const { data: huiData, error: huiError } = linkedHuiId
    ? await supabase.from("hui").select("*").eq("id", linkedHuiId).maybeSingle()
    : { data: null, error: null };

  const { data: decisionData, error: decisionError } = linkedDecisionId
    ? await supabase
        .from("decisions")
        .select("*")
        .eq("id", linkedDecisionId)
        .maybeSingle()
    : { data: null, error: null };

  const { data: documentData, error: documentError } = linkedDocumentId
    ? await supabase
        .from("documents")
        .select("*")
        .eq("id", linkedDocumentId)
        .maybeSingle()
    : { data: null, error: null };

  const assignedPerson = personData as PersonRecord | null;
  const linkedHui = huiData as HuiRecord | null;
  const linkedDecision = decisionData as DecisionRecord | null;
  const linkedDocument = documentData as DocumentRecord | null;

  const taskTitle = task?.title || "Untitled task";

  const assignedPersonName =
    assignedPerson?.full_name || "Unknown person";

  const linkedHuiTitle = linkedHui?.title || "Untitled hui record";
  const linkedHuiDate = linkedHui?.hui_date || linkedHui?.date || null;

  const linkedDecisionTitle =
    linkedDecision?.title || "Untitled decision record";
  const linkedDecisionDate =
    linkedDecision?.decision_date ||
    linkedDecision?.effective_date ||
    linkedDecision?.date ||
    null;

  const linkedDocumentTitle =
    linkedDocument?.title ||
    linkedDocument?.name ||
    "Untitled document record";

  const linkedDocumentUrl = linkedDocument?.file_url || linkedDocument?.url;
  const hasLinkedDocumentUrl = isUrl(linkedDocumentUrl);

  const hasActualRelatedLinks = Boolean(
    assignedPerson || linkedHui || linkedDecision || linkedDocument
  );

  return (
    <AppShell title="Task Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Task Record
        </p>

        {taskError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {taskError.message}
            </pre>
          </>
        ) : !task ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Task record not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No task record exists for this ID. Return to the tasks register
              and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {taskTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected task record and only the records
              actually linked to it through confirmed database fields.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Task Details</h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase tasks table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/tasks"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Tasks
            </Link>

            <Link
              href="/tasks/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Task
            </Link>
          </div>
        </div>

        {task ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <p className="font-medium text-stone-100">{taskTitle}</p>
                </FieldRow>

                <FieldRow label="Task ID">
                  <Link
                    href={taskPath(task.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {task.id}
                  </Link>
                </FieldRow>

                {task.description !== undefined ? (
                  <FieldRow label="Description" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(task.description)}
                    </p>
                  </FieldRow>
                ) : null}

                {task.status !== undefined ? (
                  <FieldRow label="Status">
                    {formatValue(task.status)}
                  </FieldRow>
                ) : null}

                {task.priority !== undefined ? (
                  <FieldRow label="Priority" darker>
                    {formatValue(task.priority)}
                  </FieldRow>
                ) : null}

                {task.due_date !== undefined ? (
                  <FieldRow label="Due Date">
                    {formatDate(task.due_date)}
                  </FieldRow>
                ) : null}

                {task.assigned_to_id !== undefined ? (
                  <FieldRow label="Assigned To ID" darker>
                    {task.assigned_to_id && assignedPerson ? (
                      <Link
                        href={personPath(task.assigned_to_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {task.assigned_to_id}
                      </Link>
                    ) : (
                      formatValue(task.assigned_to_id)
                    )}
                  </FieldRow>
                ) : null}

                {task.related_hui_id !== undefined ? (
                  <FieldRow label="Related Hui ID">
                    {task.related_hui_id && linkedHui ? (
                      <Link
                        href={huiPath(task.related_hui_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {task.related_hui_id}
                      </Link>
                    ) : (
                      formatValue(task.related_hui_id)
                    )}
                  </FieldRow>
                ) : null}

                {task.related_decision_id !== undefined ? (
                  <FieldRow label="Related Decision ID" darker>
                    {task.related_decision_id && linkedDecision ? (
                      <Link
                        href={decisionPath(task.related_decision_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {task.related_decision_id}
                      </Link>
                    ) : (
                      formatValue(task.related_decision_id)
                    )}
                  </FieldRow>
                ) : null}

                {task.related_document_id !== undefined ? (
                  <FieldRow label="Related Document ID">
                    {task.related_document_id && linkedDocument ? (
                      <Link
                        href={documentPath(task.related_document_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {task.related_document_id}
                      </Link>
                    ) : (
                      formatValue(task.related_document_id)
                    )}
                  </FieldRow>
                ) : null}

                <FieldRow label="Created" darker>
                  {formatDate(task.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No task record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The task record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {personError || huiError || decisionError || documentError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 grid gap-4">
            {personError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Assigned person link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {personError.message}
                </pre>
              </div>
            ) : null}

            {huiError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Hui link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {huiError.message}
                </pre>
              </div>
            ) : null}

            {decisionError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Decision link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {decisionError.message}
                </pre>
              </div>
            ) : null}

            {documentError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Document link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {documentError.message}
                </pre>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {assignedPerson ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Assigned Person
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This person is directly linked to the task through
                assigned_to_id.
              </p>
            </div>

            <Link
              href={personPath(assignedPerson.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Person
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Full Name" darker>
                  <Link
                    href={personPath(assignedPerson.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {assignedPersonName}
                  </Link>
                </FieldRow>

                <FieldRow label="Person ID">
                  <Link
                    href={personPath(assignedPerson.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {assignedPerson.id}
                  </Link>
                </FieldRow>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedHui ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Hui Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This hui is directly linked to the current task through
                related_hui_id.
              </p>
            </div>

            <Link
              href={huiPath(linkedHui.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Hui
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={huiPath(linkedHui.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedHuiTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Hui ID">
                  <Link
                    href={huiPath(linkedHui.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedHui.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Date" darker>
                  {formatDate(linkedHuiDate)}
                </FieldRow>

                <FieldRow label="Location">
                  {formatValue(linkedHui.location)}
                </FieldRow>

                {linkedHui.status !== undefined ? (
                  <FieldRow label="Status" darker>
                    {formatValue(linkedHui.status)}
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedDecision ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Decision Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This decision is directly linked to the current task through
                related_decision_id.
              </p>
            </div>

            <Link
              href={decisionPath(linkedDecision.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Decision
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={decisionPath(linkedDecision.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedDecisionTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Decision ID">
                  <Link
                    href={decisionPath(linkedDecision.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedDecision.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Decision Date" darker>
                  {formatDate(linkedDecisionDate)}
                </FieldRow>

                {linkedDecision.status !== undefined ? (
                  <FieldRow label="Status">
                    {formatValue(linkedDecision.status)}
                  </FieldRow>
                ) : null}

                {linkedDecision.decision !== undefined ||
                linkedDecision.decision_text !== undefined ? (
                  <FieldRow label="Decision" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(
                        linkedDecision.decision ||
                          linkedDecision.decision_text ||
                          null
                      )}
                    </p>
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedDocument ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Document Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This document is directly linked to the current task through
                related_document_id.
              </p>
            </div>

            <Link
              href={documentPath(linkedDocument.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Document
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={documentPath(linkedDocument.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedDocumentTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Document ID">
                  <Link
                    href={documentPath(linkedDocument.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedDocument.id}
                  </Link>
                </FieldRow>

                {linkedDocument.document_type !== undefined ? (
                  <FieldRow label="Document Type" darker>
                    {formatValue(linkedDocument.document_type)}
                  </FieldRow>
                ) : null}

                {linkedDocument.status !== undefined ? (
                  <FieldRow label="Status">
                    {formatValue(linkedDocument.status)}
                  </FieldRow>
                ) : null}

                {linkedDocumentUrl !== undefined ? (
                  <FieldRow label="File URL" darker>
                    {hasLinkedDocumentUrl ? (
                      <a
                        href={linkedDocumentUrl ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {linkedDocumentUrl}
                      </a>
                    ) : (
                      formatValue(linkedDocumentUrl)
                    )}
                  </FieldRow>
                ) : null}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {task && hasActualRelatedLinks ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Related Links
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Only records directly linked to this task record are shown here.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {assignedPerson ? (
              <Link
                href={personPath(assignedPerson.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {assignedPersonName}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open assigned person record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {assignedPerson.id}
                </p>
              </Link>
            ) : null}

            {linkedHui ? (
              <Link
                href={huiPath(linkedHui.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedHuiTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked hui record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedHui.id}
                </p>
              </Link>
            ) : null}

            {linkedDecision ? (
              <Link
                href={decisionPath(linkedDecision.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedDecisionTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked decision record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedDecision.id}
                </p>
              </Link>
            ) : null}

            {linkedDocument ? (
              <Link
                href={documentPath(linkedDocument.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedDocumentTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked document record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedDocument.id}
                </p>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}