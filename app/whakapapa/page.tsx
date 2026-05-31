import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type LinkedPerson = {
  full_name: string;
};

type WhakapapaRelationship = {
  id: string;
  person_a_id: string;
  person_b_id: string;
  relationship_type: string;
  created_at: string;
  person_a: LinkedPerson | null;
  person_b: LinkedPerson | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function WhakapapaPage() {
  const { data, error } = await supabase
    .from("whakapapa_relationships")
    .select(
      `
      id,
      person_a_id,
      person_b_id,
      relationship_type,
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

  const relationshipRecords =
    (data ?? []) as unknown as WhakapapaRelationship[];

  return (
    <AppShell title="Whakapapa" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Whakapapa Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Whakapapa
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage relationship records between people. Each whakapapa record
          links two identity records together and can later connect to source
          documents, whenua, governance context, and activity history.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Whakapapa Register
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase whakapapa_relationships
              table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {relationshipRecords.length} records
            </div>

            <a
              href="/whakapapa/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Relationship
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : relationshipRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No whakapapa records yet
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add the first relationship record to begin building the whakapapa
              layer.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">First Person</th>
                  <th className="px-4 py-3 font-medium">Relationship</th>
                  <th className="px-4 py-3 font-medium">Second Person</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {relationshipRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4">
                      <a
                        href={`/people/${record.person_a_id}`}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.person_a?.full_name || "Unknown person"}
                      </a>
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {record.relationship_type}
                    </td>

                    <td className="px-4 py-4">
                      <a
                        href={`/people/${record.person_b_id}`}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.person_b?.full_name || "Unknown person"}
                      </a>
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatDate(record.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <a
                        href={`/whakapapa/${record.id}`}
                        className="text-sm font-medium text-stone-300 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        View relationship
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Related Records
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Useful pathways connected to whakapapa records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/people"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View People
            </a>

            <a
              href="/whakapapa/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Relationship
            </a>
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
              View the identity records used in relationships.
            </p>
          </a>

          <a
            href="/whakapapa/new"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">
              Add Relationship
            </h3>

            <p className="mt-1 text-sm text-stone-400">
              Create a new connection between two people.
            </p>
          </a>

          <a
            href="/whenua"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Whenua</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future whenua connections through whakapapa lines.
            </p>
          </a>

          <a
            href="/documents"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Documents</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future source records and supporting evidence.
            </p>
          </a>

          <a
            href="/governance"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Governance</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future authority and decision context.
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