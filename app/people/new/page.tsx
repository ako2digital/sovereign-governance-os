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

const futureLinks = [
  "Whakapapa relationship",
  "Hui attendance",
  "Assigned tasks",
  "Activity history",
];

export default function NewPersonPage() {
  return (
    <AppShell title="Add Person" eyebrow="Core Records / People">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/people"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to People Register
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            New person record
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Add an identity record to the system.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
            A person record becomes the anchor point for future whakapapa,
            hui, tasks, roles, documents, and activity history.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <form
            action={createPerson}
            className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8"
          >
            <div className="border-b border-stone-800 pb-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Core details
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Confirm the base identity field.
              </h2>
            </div>

            <div className="mt-6 grid gap-6">
              <label className="grid gap-3">
                <span className="text-sm font-semibold text-stone-300">
                  Full name <span className="text-red-300">*</span>
                </span>

                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  placeholder="Enter full name"
                  className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </label>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
                  Current schema
                </p>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  This MVP currently records one confirmed field: full_name.
                  Extra identity fields should be added only when the register
                  structure is agreed.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Create Person
                </button>

                <a
                  href="/people"
                  className="rounded-full border border-stone-700 px-6 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  Cancel
                </a>
              </div>
            </div>
          </form>

          <aside className="grid gap-6">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <div className="mt-5 grid gap-3">
                {futureLinks.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4"
                  >
                    <p className="text-sm font-semibold text-white">{item}</p>

                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      Available after the person record exists.
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Record flow
              </p>

              <p className="mt-5 text-sm leading-7 text-stone-400">
                Create the person first. Then link them to whakapapa,
                attendance, roles, tasks, documents, and activity as the
                system expands.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}