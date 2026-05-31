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
    <AppShell title="Tasks" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Tasks Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Tasks</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage task records, priorities, due dates, status, assigned people,
          linked hui references, linked decision references, and linked document
          references.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Tasks Register
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase tasks table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {taskRecords.length} records
            </div>

            <Link
              href="/tasks/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Task
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : taskRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No task records yet
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add the first task record to begin building the work and
              accountability layer.
            </p>

            <div className="mt-5">
              <Link
                href="/tasks/new"
                className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add First Task
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full min-w-[1120px] border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
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
                    className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={taskPath(record.id)}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {getTaskTitle(record)}
                      </Link>

                      {record.description ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-stone-500">
                          {record.description}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.priority)}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatDate(record.due_date)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(record.assigned_to_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(record.related_hui_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={taskPath(record.id)}
                        className="font-mono text-xs text-stone-500 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={taskPath(record.id)}
                        className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
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