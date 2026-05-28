import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhakapapaRelationship = {
  id: string;
  relationship_type: string;
  notes: string | null;
  visibility_status: string | null;
  created_at: string;
  person_a: {
    full_name: string;
  } | null;
  person_b: {
    full_name: string;
  } | null;
};

export default async function WhakapapaPage() {
  const { data, error } = await supabase
    .from("whakapapa_relationships")
    .select(
      `
      id,
      relationship_type,
      notes,
      visibility_status,
      created_at,
      person_a:person_a_id (
        full_name
      ),
      person_b:person_b_id (
        full_name
      )
    `
    )
    .order("created_at", { ascending: false });

  const relationships = (data ?? []) as WhakapapaRelationship[];

  return (
    <AppShell title="Whakapapa" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Relational Records
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">Whakapapa</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Record basic whakapapa relationships, connection notes, and supporting
          document references.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Whakapapa Relationship Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase whakapapa_relationships
              table.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {relationships.length} records
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : relationships.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No whakapapa relationships yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first whakapapa relationship in Supabase to begin testing
              relational records.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Person A</th>
                  <th className="px-4 py-3 font-medium">Relationship</th>
                  <th className="px-4 py-3 font-medium">Person B</th>
                  <th className="px-4 py-3 font-medium">Visibility</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>

              <tbody>
                {relationships.map((relationship) => (
                  <tr
                    key={relationship.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {relationship.person_a?.full_name || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {relationship.relationship_type}
                    </td>
                    <td className="px-4 py-4 text-stone-100">
                      {relationship.person_b?.full_name || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {relationship.visibility_status || "private"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {relationship.notes || "—"}
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
