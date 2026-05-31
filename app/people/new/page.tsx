import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

async function createPerson(formData: FormData) {
  "use server";

  const fullName = String(formData.get("full_name") || "").trim();

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

export default function AddPersonPage() {
  return (
    <AppShell title="Add Person" eyebrow="People Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Person Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Person
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a new identity record. This person can later be connected to
          whakapapa relationships, hui, tasks, documents, and activity records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Person Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Enter the core identity information for this person record.
            </p>
          </div>

          <Link
            href="/people"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Back to People
          </Link>
        </div>

        <form action={createPerson} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="full_name"
              className="text-sm font-medium text-stone-300"
            >
              Full Name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              required
              placeholder="Enter full name"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Create Person
            </button>

            <Link
              href="/people"
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </AppShell>
  );
}