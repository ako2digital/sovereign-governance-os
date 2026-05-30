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
    <AppShell title="Add Person" eyebrow="Core Records / People">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/people"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to People Register
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            New base record
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Add a person to the relational system.
          </h1>

          <p className="mt-5 text-lg leading-8 text-stone-400">
            A person record becomes the anchor point for future whakapapa links,
            whenua relationships, marae roles, governance responsibilities,
            documents, hui attendance, decisions, and activity history.
          </p>

          <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
              Current rule
            </p>

            <p className="mt-3 text-sm leading-7 text-stone-400">
              This MVP only captures the full name. More identity fields can be
              added later after the register structure is stable and agreed.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Create record
          </p>

          <form action={createPerson} className="mt-8 grid gap-6">
            <div>
              <label
                htmlFor="full_name"
                className="block text-sm font-semibold text-stone-300"
              >
                Full name
              </label>

              <input
                id="full_name"
                name="full_name"
                type="text"
                required
                placeholder="Enter full name"
                className="mt-3 w-full rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
              />
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-sm leading-7 text-stone-500">
                After submission, the record will be inserted into the Supabase
                people table and the app will return to the People Register.
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
          </form>
        </div>
      </section>
    </AppShell>
  );
}