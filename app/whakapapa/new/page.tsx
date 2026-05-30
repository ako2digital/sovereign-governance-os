import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { redirect } from "next/navigation";

type PersonRecord = {
  id: string;
  full_name: string;
};

async function createRelationship(formData: FormData) {
  "use server";

  const personAId = String(formData.get("person_a_id") ?? "").trim();
  const personBId = String(formData.get("person_b_id") ?? "").trim();
  const relationshipType = String(
    formData.get("relationship_type") ?? ""
  ).trim();

  if (!personAId || !personBId || !relationshipType) {
    return;
  }

  const { error } = await supabase.from("whakapapa_relationships").insert({
    person_a_id: personAId,
    person_b_id: personBId,
    relationship_type: relationshipType,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/whakapapa");
}

export default async function NewWhakapapaRelationshipPage() {
  const { data, error } = await supabase
    .from("people")
    .select("id, full_name")
    .order("full_name", { ascending: true });

  const people = (data ?? []) as PersonRecord[];

  return (
    <AppShell
      title="Add Whakapapa Relationship"
      eyebrow="Core Records / Whakapapa"
    >
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/whakapapa"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Whakapapa
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            New relationship record
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Connect two people inside the whakapapa layer.
          </h1>

          <p className="mt-5 text-lg leading-8 text-stone-400">
            This form creates a person-to-person relationship. Each relationship
            becomes a structured link that can later support deeper whānau,
            whenua, marae, authority, and governance context.
          </p>

          <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
              Current rule
            </p>

            <p className="mt-3 text-sm leading-7 text-stone-400">
              This MVP records a simple relationship type between two existing
              people. Later, this can expand into stronger whakapapa structures,
              verification, confidence levels, source records, and tikanga-based
              visibility.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Create relationship
          </p>

          {error ? (
            <div className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
              <p className="font-semibold text-red-300">
                Could not load people records.
              </p>

              <p className="mt-3 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </div>
          ) : people.length < 2 ? (
            <div className="mt-8 rounded-2xl border border-stone-800 bg-stone-950 p-6">
              <h2 className="text-xl font-semibold text-white">
                At least two people records are required.
              </h2>

              <p className="mt-3 text-sm leading-7 text-stone-500">
                Add more people before creating a whakapapa relationship.
              </p>

              <a
                href="/people/new"
                className="mt-6 inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add Person
              </a>
            </div>
          ) : (
            <form action={createRelationship} className="mt-8 grid gap-6">
              <div>
                <label
                  htmlFor="person_a_id"
                  className="block text-sm font-semibold text-stone-300"
                >
                  First person
                </label>

                <select
                  id="person_a_id"
                  name="person_a_id"
                  required
                  className="mt-3 w-full rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                >
                  <option value="">Select first person</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="relationship_type"
                  className="block text-sm font-semibold text-stone-300"
                >
                  Relationship type
                </label>

                <input
                  id="relationship_type"
                  name="relationship_type"
                  type="text"
                  required
                  placeholder="Example: parent, child, sibling, spouse, cousin"
                  className="mt-3 w-full rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                />
              </div>

              <div>
                <label
                  htmlFor="person_b_id"
                  className="block text-sm font-semibold text-stone-300"
                >
                  Second person
                </label>

                <select
                  id="person_b_id"
                  name="person_b_id"
                  required
                  className="mt-3 w-full rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                >
                  <option value="">Select second person</option>
                  {people.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-sm leading-7 text-stone-500">
                  After submission, this relationship will be inserted into the
                  Supabase whakapapa_relationships table and the app will return
                  to the Whakapapa page.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Create Relationship
                </button>

                <a
                  href="/whakapapa"
                  className="rounded-full border border-stone-700 px-6 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  Cancel
                </a>
              </div>
            </form>
          )}
        </div>
      </section>
    </AppShell>
  );
}