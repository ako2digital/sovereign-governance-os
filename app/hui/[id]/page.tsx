import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type HuiDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  agenda?: string | null;
  purpose?: string | null;
  summary?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type LinkedPerson = {
  full_name: string;
};

type TaskRecord = {
  id: string;
  title: string | null;
  description: string | null;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  created_at: string | null;
  assigned_to_id: string | null;
  related_hui_id: string | null;
  assigned_to: LinkedPerson | null;
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

function huiPath(id: string) {
  return `/hui/${id}`;
}

function taskPath(id: string) {
  return `/tasks/${id}`;
}

function personPath(id: string) {
  return `/people/${id}`;
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

export default async function HuiDetailPage({ params }: HuiDetailPageProps) {
  const { id } = await params;

  const { data: huiData, error: huiError } = await supabase
    .from("hui")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const hui = huiData as HuiRecord | null;

  const { data: taskData, error: taskError } = await supabase
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
      assigned_to_id,
      related_hui_id,
      assigned_to:assigned_to_id (
        full_name
      )
    `
    )
    .eq("related_hui_id", id)
    .order("created_at", { ascending: false });

  const linkedTasks = (taskData ?? []) as unknown as TaskRecord[];

  const huiTitle = hui?.title || "Untitled hui record";
  const huiDate = hui?.hui_date || hui?.date || null;

  return (
    <AppShell title="Hui Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Hui Record
        </p>

        {huiError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {huiError.message}
            </pre>
          </>
        ) : !hui ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Hui record not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No hui record exists for this ID. Return to the hui register and
              select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {huiTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected hui record and only the records
              that are actually linked to this hui through confirmed database
              relationships.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Hui Details</h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase hui table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/hui"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Hui
            </Link>

            <Link
              href="/hui/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Hui
            </Link>
          </div>
        </div>

        {hui ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <p className="font-medium text-stone-100">
                    {formatValue(hui.title)}
                  </p>
                </FieldRow>

                <FieldRow label="Hui ID">
                  <Link
                    href={huiPath(hui.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {hui.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Date" darker>
                  {formatDate(huiDate)}
                </FieldRow>

                <FieldRow label="Location">
                  {formatValue(hui.location)}
                </FieldRow>

                {hui.purpose !== undefined ? (
                  <FieldRow label="Purpose" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(hui.purpose)}
                    </p>
                  </FieldRow>
                ) : null}

                {hui.agenda !== undefined ? (
                  <FieldRow label="Agenda">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(hui.agenda)}
                    </p>
                  </FieldRow>
                ) : null}

                {hui.summary !== undefined ? (
                  <FieldRow label="Summary" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(hui.summary)}
                    </p>
                  </FieldRow>
                ) : null}

                {hui.notes !== undefined ? (
                  <FieldRow label="Notes">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(hui.notes)}
                    </p>
                  </FieldRow>
                ) : null}

                {hui.status !== undefined ? (
                  <FieldRow label="Status" darker>
                    {formatValue(hui.status)}
                  </FieldRow>
                ) : null}

                <FieldRow label="Created">
                  {formatDate(hui.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No hui record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The hui record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {taskError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Task link error</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {taskError.message}
            </pre>
          </div>
        </section>
      ) : linkedTasks.length > 0 ? (
        <>
          <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Linked Tasks
                </h2>

                <p className="mt-1 text-sm text-stone-400">
                  Task records directly linked to this hui record through
                  related_hui_id.
                </p>
              </div>

              <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
                {linkedTasks.length} linked tasks
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[920px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Assigned To</th>
                    <th className="px-4 py-3 font-medium">Priority</th>
                    <th className="px-4 py-3 font-medium">Due Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {linkedTasks.map((task) => (
                    <tr
                      key={task.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={taskPath(task.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {task.title || "Untitled task"}
                        </Link>

                        <p className="mt-1 font-mono text-xs text-stone-600">
                          {task.id}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        {task.assigned_to_id ? (
                          <Link
                            href={personPath(task.assigned_to_id)}
                            className="font-medium text-stone-300 underline-offset-4 transition hover:text-white hover:underline"
                          >
                            {task.assigned_to?.full_name || "Unknown person"}
                          </Link>
                        ) : (
                          <span className="text-stone-500">—</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(task.priority)}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatDate(task.due_date)}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(task.status)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={taskPath(task.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View task
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Related Links
                </h2>

                <p className="mt-1 text-sm text-stone-400">
                  Only actual linked task records are shown here.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {linkedTasks.map((task) => (
                <Link
                  key={task.id}
                  href={taskPath(task.id)}
                  className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {task.title || "Untitled task"}
                  </h3>

                  <p className="mt-1 text-sm text-stone-400">
                    Open linked task record.
                  </p>

                  <p className="mt-4 font-mono text-xs text-stone-600">
                    {task.id}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}