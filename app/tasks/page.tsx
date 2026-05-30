import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type TaskRecord = {
  id: string;
  title: string;
  description: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  created_at: string;
  assigned_to: {
    full_name: string;
  } | null;
  related_hui: {
    title: string;
  } | null;
  related_decision: {
    title: string;
  } | null;
  related_document: {
    title: string;
  } | null;
  related_whenua: {
    title: string;
  } | null;
};

export default async function TasksPage() {
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
      created_at,
      assigned_to:assigned_to_id (
        full_name
      ),
      related_hui:related_hui_id (
        title
      ),
      related_decision:related_decision_id (
        title
      ),
      related_document:related_document_id (
        title
      ),
      related_whenua:related_whenua_id (
        title
      )
    `
    )
    .order("created_at", { ascending: false });

  const taskRecords = (data ?? []) as unknown as TaskRecord[];

  return (
    <AppShell title="Tasks" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Task Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Tasks</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Track actions connected to hui, decisions, documents, whenua, and
          operational follow-through.
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

            <a
              href="/tasks/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Task
            </a>
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
              Add the first task record to begin testing operational
              follow-through.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Related To</th>
                  <th className="px-4 py-3 font-medium">Assigned To</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Due Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {taskRecords.map((record) => {
                  const relatedTo =
                    record.related_hui?.title ||
                    record.related_decision?.title ||
                    record.related_document?.title ||
                    record.related_whenua?.title ||
                    "—";

                  return (
                    <tr
                      key={record.id}
                      className="border-t border-stone-800 bg-stone-900"
                    >
                      <td className="px-4 py-4">
                        <a
                          href={`/tasks/${record.id}`}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {record.title}
                        </a>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {relatedTo}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {record.assigned_to?.full_name || "—"}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {record.priority || "normal"}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {record.due_date || "—"}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {record.status || "todo"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}