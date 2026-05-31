import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PersonRecord = {
  id: string;
  full_name: string;
  created_at: string | null;
};

async function createWhakapapaRelationship(formData: FormData) {
  "use server";

  const personAId = String(formData.get("person_a_id") || "").trim();
  const personBId = String(formData.get("person_b_id") || "").trim();
  const relationshipType = String(
    formData.get("relationship_type") || ""
  ).trim();

  if (!personAId || !personBId || !relationshipType) {
    return;
  }

  if (personAId === personBId) {
    throw new Error("A whakapapa relationship requires two different people.");
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

export default async function AddWhakapapaPage() {
  const { data, error } = await supabase
    .from("people")
    .select(
      `
      id,
      full_name,
      created_at
    `
    )
    .order("full_name", { ascending: true });

  const peopleRecords = (data ?? []) as PersonRecord[];

  return (
    <AppShell title="Add Whakapapa" eyebrow="Whakapapa Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Whakapapa Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Whakapapa Relationship
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a relationship record between two existing people. This builds
          the relational layer used for whakapapa mapping and future
          verification work.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Relationship Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Select two existing people and define the relationship type.
            </p>
          </div>

          <Link
            href="/whakapapa"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Back to Whakapapa
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : peopleRecords.length < 2 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              At least two people are required
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add two person records before creating a whakapapa relationship.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/people/new"
                className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add Person
              </Link>

              <Link
                href="/people"
                className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                View People
              </Link>
            </div>
          </div>
        ) : (
          <form action={createWhakapapaRelationship} className="mt-6 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="person_a_id"
                  className="text-sm font-medium text-stone-300"
                >
                  First Person
                </label>

                <select
                  id="person_a_id"
                  name="person_a_id"
                  required
                  className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
                >
                  <option value="">Select first person</option>

                  {peopleRecords.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="person_b_id"
                  className="text-sm font-medium text-stone-300"
                >
                  Second Person
                </label>

                <select
                  id="person_b_id"
                  name="person_b_id"
                  required
                  className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
                >
                  <option value="">Select second person</option>

                  {peopleRecords.map((person) => (
                    <option key={person.id} value={person.id}>
                      {person.full_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="relationship_type"
                className="text-sm font-medium text-stone-300"
              >
                Relationship Type
              </label>

              <input
                id="relationship_type"
                name="relationship_type"
                type="text"
                required
                placeholder="Example: parent, child, sibling, spouse, tupuna, descendant"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Create Relationship
              </button>

              <Link
                href="/whakapapa"
                className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Available People
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Existing people that can be selected for the relationship.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {peopleRecords.length} people
          </div>
        </div>

        {peopleRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No people available
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add people before creating whakapapa relationships.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Full Name</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Person ID</th>
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
                        {person.full_name}
                      </Link>
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatDate(person.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={personPath(person.id)}
                        className="font-mono text-xs text-stone-500 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {person.id}
                      </Link>
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
      </section>
    </AppShell>
  );
}