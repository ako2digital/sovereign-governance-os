import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

async function createPerson(formData: FormData) {
  "use server";

  const fullName = String(formData.get("full_name") ?? "").trim();

  if (!fullName) {
    return;
  }

  const { error } = await supabase.from("people").insert({
    full_name: fullName,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/people");
}

export default function NewPersonPage() {
  return (
    <AppShell title="Add Person" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Person Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Person
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a base identity record. Once created, this person can be linked
          to whakapapa relationships, hui attendance, assigned tasks, documents,
          roles, and future activity history.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Person Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              This form writes to the Supabase people table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/people"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to People
            </a>

            <a
              href="/whakapapa"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Whakapapa
            </a>
          </div>
        </div>

        <form action={createPerson} className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Full Name
            </span>

            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              placeholder="Enter full name"
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-500"
            />
          </label>

          <div className="rounded-xl border border-stone-800 bg-stone-950 p-4">
            <h3 className="text-base font-semibold text-white">
              Current Schema
            </h3>

            <p className="mt-2 text-sm leading-6 text-stone-400">
              This MVP currently records one confirmed field:{" "}
              <span className="font-mono text-stone-300">full_name</span>.
              Additional identity fields can be added after the people register
              structure is confirmed.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Create Person
            </button>

            <a
              href="/people"
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </a>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Related Pathways
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              These links become useful after the person record exists.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <a
            href="/people"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">
              People Register
            </h3>

            <p className="mt-1 text-sm text-stone-400">
              Return to all people records.
            </p>
          </a>

          <a
            href="/whakapapa/new"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">
              Add Whakapapa
            </h3>

            <p className="mt-1 text-sm text-stone-400">
              Create a relationship after this person exists.
            </p>
          </a>

          <a
            href="/hui"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Hui</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future attendance and participation records.
            </p>
          </a>

          <a
            href="/tasks"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Tasks</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future assigned actions and follow-up.
            </p>
          </a>

          <a
            href="/documents"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Documents</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future files or evidence linked to people.
            </p>
          </a>

          <a
            href="/activity"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Activity</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future record history and audit trail.
            </p>
          </a>
        </div>
      </section>
    </AppShell>
  );
}