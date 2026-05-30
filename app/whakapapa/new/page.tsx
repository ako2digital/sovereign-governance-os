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

const futureLinks = [
  "Linked person records",
  "Whenua connections",
  "Supporting source documents",
  "Relationship activity history",
];

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
      <section className="grid gap-6">
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

          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Link two people into the whakapapa layer.
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
            A relationship record connects one person to another. Once created,
            each person should remain clickable and the relationship should be
            traceable through source records, whenua connections, and activity
            history as the system expands.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
            <div className="border-b border-stone-800 pb-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Core details
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Select both people and define the relationship.
              </h2>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                <p className="font-semibold text-red-300">
                  Could not load people records.
                </p>

                <p className="mt-3 text-sm leading-7 text-red-200/80">
                  {error.message}
                </p>
              </div>
            ) : people.length < 2 ? (
              <div className="mt-6 rounded-2xl border border-stone-800 bg-stone-950 p-6">
                <h3 className="text-xl font-semibold text-white">
                  At least two people records are required.
                </h3>

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
              <form action={createRelationship} className="mt-6 grid gap-6">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="grid gap-3">
                    <span className="text-sm font-semibold text-stone-300">
                      First person <span className="text-red-300">*</span>
                    </span>

                    <select
                      id="person_a_id"
                      name="person_a_id"
                      required
                      className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                    >
                      <option value="">Select first person</option>
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.full_name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-3">
                    <span className="text-sm font-semibold text-stone-300">
                      Second person <span className="text-red-300">*</span>
                    </span>

                    <select
                      id="person_b_id"
                      name="person_b_id"
                      required
                      className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition focus:border-stone-400"
                    >
                      <option value="">Select second person</option>
                      {people.map((person) => (
                        <option key={person.id} value={person.id}>
                          {person.full_name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-3">
                  <span className="text-sm font-semibold text-stone-300">
                    Relationship type <span className="text-red-300">*</span>
                  </span>

                  <input
                    id="relationship_type"
                    name="relationship_type"
                    type="text"
                    required
                    placeholder="Example: parent, child, sibling, spouse, cousin"
                    className="rounded-2xl border border-stone-700 bg-stone-950 px-5 py-4 text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-stone-400"
                  />
                </label>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.25em] text-stone-600">
                    Current schema
                  </p>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    This MVP records person_a_id, person_b_id, and
                    relationship_type. Source documents, certainty level, and
                    visibility rules can be added after the core flow is stable.
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
          </section>

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
                      Available after the relationship record exists.
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
                Create the relationship first. Then connect the relationship to
                source documents, whenua, people detail pages, and future
                activity history.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}