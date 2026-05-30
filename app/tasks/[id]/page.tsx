import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type TaskDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type TaskRecord = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  assigned_to_id: string | null;
  related_hui_id: string | null;
  related_decision_id: string | null;
  related_document_id: string | null;
  related_whenua_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function TaskDetailPage({
  params,
}: TaskDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("tasks")
    .select(
      `
      id,
      title,
      description,
      status,
      priority,
      due_date,
      assigned_to_id,
      related_hui_id,
      related_decision_id,
      related_document_id,
      related_whenua_id,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const task = data as TaskRecord | null;

  return (
    <AppShell title="Task Detail" eyebrow="Tasks Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/tasks"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Tasks
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Task Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {task?.title || "Task Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected action item from the hapū relational infrastructure
          database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !task ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Task not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No task record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the tasks table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {task.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {task.status || "todo"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Priority
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {task.priority || "normal"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Due Date
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {task.due_date || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {task.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {task.updated_at || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Description
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {task.description || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Record IDs
              </p>

              <div className="mt-4 grid gap-3 text-sm text-stone-300">
                <p>
                  <span className="text-stone-500">Assigned To ID:</span>{" "}
                  <span className="break-all">
                    {task.assigned_to_id || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">Hui ID:</span>{" "}
                  <span className="break-all">
                    {task.related_hui_id || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">Decision ID:</span>{" "}
                  <span className="break-all">
                    {task.related_decision_id || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">Document ID:</span>{" "}
                  <span className="break-all">
                    {task.related_document_id || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">Whenua ID:</span>{" "}
                  <span className="break-all">
                    {task.related_whenua_id || "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Record ID
              </p>
              <p className="mt-3 break-all text-sm text-stone-300">
                {task.id}
              </p>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}