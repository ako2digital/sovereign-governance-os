import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

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

async function createTask(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const priority = String(formData.get("priority") || "").trim();
  const dueDate = String(formData.get("due_date") || "").trim();
  const assignedToId = String(formData.get("assigned_to_id") || "").trim();
  const relatedHuiId = String(formData.get("related_hui_id") || "").trim();

  if (!title) {
    return;
  }

  const { error } = await supabase.from("tasks").insert({
    title,
    description: description || null,
    status: status || null,
    priority: priority || null,
    due_date: dueDate || null,
    assigned_to_id: assignedToId || null,
    related_hui_id: relatedHuiId || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/tasks");
}

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

function personPath(id: string) {
  return `/people/${id}`;
}

function huiPath(id: string) {
  return `/hui/${id}`;
}

function getPersonName(record: PersonRecord) {
  return record.full_name || "Unnamed person";
}

function getHuiTitle(record: HuiRecord) {
  return record.title || "Untitled hui record";
}

function getHuiDate(record: HuiRecord) {
  return record.hui_date || record.date || null;
}

export default async function AddTaskPage() {
  const { data: peopleData, error: peopleError } = await supabase
    .from("people")
    .select(
      `
      id,
      full_name,
      created_at
    `
    )
    .order("full_name", { ascending: true });

  const { data: huiData, error: huiError } = await supabase
    .from("hui")
    .select("*")
    .order("created_at", { ascending: false });

  const peopleRecords = (peopleData ?? []) as PersonRecord[];
  const huiRecords = (huiData ?? []) as HuiRecord[];

  return (
    <AppShell title="Add Task" eyebrow="Tasks Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Task Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Add Task</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a task record with its title, description, status, priority,
          due date, optional assigned person, and optional hui reference.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Task Details</h2>

            <p className="mt-1 text-sm text-stone-400">
              Enter the confirmed task information. Only the title is required
              at this stage.
            </p>
          </div>

          <Link
            href="/tasks"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Back to Tasks
          </Link>
        </div>

        {peopleError || huiError ? (
          <div className="mt-6 grid gap-4">
            {peopleError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">People database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {peopleError.message}
                </pre>
              </div>
            ) : null}

            {huiError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Hui database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {huiError.message}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        <form action={createTask} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-stone-300"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Prepare draft agenda for next hui"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-stone-300"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Enter task details, expected outcome, context, or follow-up notes"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-stone-300"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">Select status</option>
                <option value="todo">To Do</option>
                <option value="in progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="priority"
                className="text-sm font-medium text-stone-300"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">Select priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="due_date"
                className="text-sm font-medium text-stone-300"
              >
                Due Date
              </label>

              <input
                id="due_date"
                name="due_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="assigned_to_id"
                className="text-sm font-medium text-stone-300"
              >
                Assigned Person
              </label>

              <select
                id="assigned_to_id"
                name="assigned_to_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No assigned person</option>

                {peopleRecords.map((person) => (
                  <option key={person.id} value={person.id}>
                    {getPersonName(person)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="related_hui_id"
                className="text-sm font-medium text-stone-300"
              >
                Related Hui
              </label>

              <select
                id="related_hui_id"
                name="related_hui_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No related hui</option>

                {huiRecords.map((hui) => (
                  <option key={hui.id} value={hui.id}>
                    {getHuiTitle(hui)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Create Task
            </button>

            <Link
              href="/tasks"
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Available People
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Existing people records available for optional assignment.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {peopleRecords.length} records
            </div>
          </div>

          {peopleRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
              <h3 className="text-base font-semibold text-white">
                No people records available
              </h3>

              <p className="mt-2 text-sm text-stone-400">
                Add people records before assigning tasks.
              </p>

              <div className="mt-5">
                <Link
                  href="/people/new"
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add Person
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Full Name</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {peopleRecords.map((person) => (
                    <tr
                      key={person.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={personPath(person.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {getPersonName(person)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatDate(person.created_at)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={personPath(person.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View person
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Available Hui
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Existing hui records available for optional task linking.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {huiRecords.length} records
            </div>
          </div>

          {huiRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
              <h3 className="text-base font-semibold text-white">
                No hui records available
              </h3>

              <p className="mt-2 text-sm text-stone-400">
                Add hui records before linking tasks to hui.
              </p>

              <div className="mt-5">
                <Link
                  href="/hui/new"
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add Hui
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {huiRecords.map((hui) => (
                    <tr
                      key={hui.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {getHuiTitle(hui)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatDate(getHuiDate(hui))}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(hui.location)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View hui
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}