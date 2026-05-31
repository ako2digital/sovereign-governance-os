import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhakapapaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

export default async function WhakapapaDetailPage({
  params,
}: WhakapapaDetailPageProps) {
  const { id } = await params;

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
    .eq("id", id)
    .maybeSingle();

  const relationship = data as unknown as WhakapapaRelationship | null;

  const firstPersonName =
    relationship?.person_a?.full_name || "Unknown person";

  const secondPersonName =
    relationship?.person_b?.full_name || "Unknown person";

  return (
    <AppShell title="Whakapapa Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Whakapapa Relationship Record
        </p>

        {error ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {error.message}
            </pre>
          </>
        ) : !relationship ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Relationship not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No whakapapa relationship exists for this ID. Return to the
              whakapapa register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {firstPersonName} → {secondPersonName}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This record links two people inside the whakapapa layer. Each
              person remains connected back to their identity record, and the
              relationship can later connect to documents, whenua, governance
              records, and activity history.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Relationship Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Core fields from the Supabase whakapapa_relationships table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/whakapapa"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Whakapapa
            </a>

            <a
              href="/whakapapa/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Relationship
            </a>
          </div>
        </div>

        {relationship ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <tr className="border-t border-stone-800 bg-stone-950">
                  <th className="w-52 px-4 py-4 font-medium text-stone-400">
                    First Person
                  </th>

                  <td className="px-4 py-4">
                    <a
                      href={`/people/${relationship.person_a_id}`}
                      className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {firstPersonName}
                    </a>
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-900">
                  <th className="w-52 px-4 py-4 font-medium text-stone-400">
                    Relationship Type
                  </th>

                  <td className="px-4 py-4 text-stone-300">
                    {relationship.relationship_type}
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-950">
                  <th className="w-52 px-4 py-4 font-medium text-stone-400">
                    Second Person
                  </th>

                  <td className="px-4 py-4">
                    <a
                      href={`/people/${relationship.person_b_id}`}
                      className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {secondPersonName}
                    </a>
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-900">
                  <th className="w-52 px-4 py-4 font-medium text-stone-400">
                    Created
                  </th>

                  <td className="px-4 py-4 text-stone-300">
                    {formatDate(relationship.created_at)}
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-950">
                  <th className="w-52 px-4 py-4 font-medium text-stone-400">
                    Relationship ID
                  </th>

                  <td className="px-4 py-4">
                    <a
                      href={`/whakapapa/${relationship.id}`}
                      className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {relationship.id}
                    </a>
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-900">
                  <th className="w-52 px-4 py-4 font-medium text-stone-400">
                    First Person ID
                  </th>

                  <td className="px-4 py-4">
                    <a
                      href={`/people/${relationship.person_a_id}`}
                      className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {relationship.person_a_id}
                    </a>
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-950">
                  <th className="w-52 px-4 py-4 font-medium text-stone-400">
                    Second Person ID
                  </th>

                  <td className="px-4 py-4">
                    <a
                      href={`/people/${relationship.person_b_id}`}
                      className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {relationship.person_b_id}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No relationship loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The relationship record could not be displayed.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Linked People
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Direct person records connected by this whakapapa relationship.
            </p>
          </div>
        </div>

        {relationship ? (
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <a
              href={`/people/${relationship.person_a_id}`}
              className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
            >
              <h3 className="text-sm font-semibold text-white">
                {firstPersonName}
              </h3>

              <p className="mt-1 text-sm text-stone-400">
                Open first person record.
              </p>

              <p className="mt-3 font-mono text-xs text-stone-600">
                {relationship.person_a_id}
              </p>
            </a>

            <a
              href={`/people/${relationship.person_b_id}`}
              className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
            >
              <h3 className="text-sm font-semibold text-white">
                {secondPersonName}
              </h3>

              <p className="mt-1 text-sm text-stone-400">
                Open second person record.
              </p>

              <p className="mt-3 font-mono text-xs text-stone-600">
                {relationship.person_b_id}
              </p>
            </a>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No linked people available
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Linked people cannot be displayed because the relationship record
              was not loaded.
            </p>
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
              Useful pathways connected to this whakapapa relationship.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <a
            href={`/whakapapa/${relationship?.id ?? id}`}
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">
              Current Relationship
            </h3>

            <p className="mt-1 text-sm text-stone-400">
              Return to this whakapapa detail record.
            </p>
          </a>

          <a
            href="/whakapapa"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">
              Whakapapa Register
            </h3>

            <p className="mt-1 text-sm text-stone-400">
              Return to all relationship records.
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
              Create another relationship record.
            </p>
          </a>

          <a
            href="/people"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">
              People Register
            </h3>

            <p className="mt-1 text-sm text-stone-400">
              View all identity records.
            </p>
          </a>

          <a
            href="/whenua"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Whenua</h3>

            <p className="mt-1 text-sm text-stone-400">
              Future whenua links through whakapapa lines.
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