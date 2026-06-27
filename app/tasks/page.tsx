import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

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

function taskPath(id: string) {
  return `/tasks/${id}`;
}

function getTaskTitle(record: TaskRecord) {
  return record.title || "Untitled task";
}

export default async function TasksPage() {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("created_at", { ascending: false });

  const taskRecords = (data ?? []) as TaskRecord[];

  return (
    <AppShell title="Tasks" eyebrow="Governance Chain">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Governance Chain
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Tasks</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Decisions turned into action. Tasks connect decisions to delivery — each task should
          trace back to the decision that authorised it and the hui that produced it.
          Completing tasks and reporting back to the people closes the governance chain and
          turns records into provable outcomes.
        </p>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            Pathway to outcome
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Tasks carry authority from the decision that created them. Completing tasks and
            attaching evidence turns governance work into reportable, fundable outcomes.
            Link tasks to decisions and hui to close the chain.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Tasks Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {taskRecords.length} {taskRecords.length === 1 ? "task" : "tasks"} on record
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {taskRecords.length} records
            </div>

            <Link
              href="/tasks/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Task
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : taskRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No task records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first task record to begin building the work and
              accountability layer.
            </p>

            <div className="mt-5">
              <Link
                href="/tasks/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Task
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Task</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                  <th className="px-4 py-3 font-medium">Assigned To ID</th>
                  <th className="px-4 py-3 font-medium">Linked Hui ID</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {taskRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={taskPath(record.id)}
                        className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        {getTaskTitle(record)}
                      </Link>

                      {record.description ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-[var(--muted-foreground)]">
                          {record.description}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.priority)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatDate(record.due_date)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(record.assigned_to_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(record.related_hui_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={taskPath(record.id)}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={taskPath(record.id)}
                        className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        View record
                      </Link>
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
