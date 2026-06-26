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

type DecisionRecord = {
  id: string;
  title?: string | null;
  status?: string | null;
  decision_date?: string | null;
  effective_date?: string | null;
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
  const relatedDecisionId = String(formData.get("related_decision_id") || "").trim();

  if (!title) {
    return;
  }

  const { data, error } = await supabase.from("tasks").insert({
    title,
    description: description || null,
    status: status || null,
    priority: priority || null,
    due_date: dueDate || null,
    assigned_to_id: assignedToId || null,
    related_hui_id: relatedHuiId || null,
    related_decision_id: relatedDecisionId || null,
  }).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/tasks/${data.id}`);
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

function getDecisionTitle(record: DecisionRecord) {
  return record.title || "Untitled decision";
}

export default async function AddTaskPage() {
  const [peopleResult, huiResult, decisionsResult] = await Promise.all([
    supabase
      .from("people")
      .select("id, full_name, created_at")
      .order("full_name", { ascending: true }),
    supabase.from("hui").select("id, title, hui_date, date, location, status, created_at").order("created_at", { ascending: false }),
    supabase.from("decisions").select("id, title, status, decision_date, effective_date, created_at").order("created_at", { ascending: false }),
  ]);

  const { data: peopleData, error: peopleError } = peopleResult;
  const { data: huiData, error: huiError } = huiResult;
  const { data: decisionsData, error: decisionsError } = decisionsResult;

  const peopleRecords = (peopleData ?? []) as PersonRecord[];
  const huiRecords = (huiData ?? []) as HuiRecord[];
  const decisionRecords = (decisionsData ?? []) as DecisionRecord[];

  return (
    <AppShell title="Add Task" eyebrow="Tasks Module">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          New Task Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Add Task</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Create a task record with its title, description, status, priority,
          due date, optional assigned person, and optional hui reference.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Task Details</h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Enter the confirmed task information. Only the title is required
              at this stage.
            </p>
          </div>

          <Link
            href="/tasks"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Tasks
          </Link>
        </div>

        {peopleError || huiError || decisionsError ? (
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

            {decisionsError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Decisions database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {decisionsError.message}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        <form action={createTask} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Prepare draft agenda for next hui"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={6}
              placeholder="Enter task details, expected outcome, context, or follow-up notes"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label
                htmlFor="status"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Status
              </label>

              <select
                id="status"
                name="status"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Priority
              </label>

              <select
                id="priority"
                name="priority"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Due Date
              </label>

              <input
                id="due_date"
                name="due_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="assigned_to_id"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Assigned Person
              </label>

              <select
                id="assigned_to_id"
                name="assigned_to_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Related Hui
              </label>

              <select
                id="related_hui_id"
                name="related_hui_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
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

          <div>
            <label
              htmlFor="related_decision_id"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Linked Decision
            </label>

            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Link this task to the decision that produced it — this completes the governance chain.
            </p>

            <select
              id="related_decision_id"
              name="related_decision_id"
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">No linked decision</option>

              {decisionRecords.map((decision) => (
                <option key={decision.id} value={decision.id}>
                  {getDecisionTitle(decision)}
                  {decision.status ? ` — ${decision.status}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Create Task
            </button>

            <Link
              href="/tasks"
              className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Available People
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing people records available for optional assignment.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {peopleRecords.length} records
            </div>
          </div>

          {peopleRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No people records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add people records before assigning tasks.
              </p>

              <div className="mt-5">
                <Link
                  href="/people/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Person
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
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
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={personPath(person.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {getPersonName(person)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatDate(person.created_at)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={personPath(person.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
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

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Available Hui
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Existing hui records available for optional task linking.
              </p>
            </div>

            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {huiRecords.length} records
            </div>
          </div>

          {huiRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
              <h3 className="text-base font-semibold text-[var(--foreground)]">
                No hui records available
              </h3>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                Add hui records before linking tasks to hui.
              </p>

              <div className="mt-5">
                <Link
                  href="/hui/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Hui
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
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
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {getHuiTitle(hui)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatDate(getHuiDate(hui))}
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatValue(hui.location)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={huiPath(hui.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
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