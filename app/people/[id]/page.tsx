import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PeopleDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type PersonRecord = {
  id: string;
  full_name: string;
  created_at: string;
};

type WhakapapaRelationship = {
  id: string;
  relationship_type: string;
  person_a_id: string;
  person_b_id: string;
  person_a: {
    full_name: string;
  } | null;
  person_b: {
    full_name: string;
  } | null;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function PeopleDetailPage({
  params,
}: PeopleDetailPageProps) {
  const { id } = await params;

  const personResult = await supabase
    .from("people")
    .select("id, full_name, created_at")
    .eq("id", id)
    .maybeSingle();

  const relationshipResult = await supabase
    .from("whakapapa_relationships")
    .select(
      `
      id,
      relationship_type,
      person_a_id,
      person_b_id,
      person_a:person_a_id (
        full_name
      ),
      person_b:person_b_id (
        full_name
      )
    `
    )
    .or(`person_a_id.eq.${id},person_b_id.eq.${id}`)
    .order("created_at", { ascending: false });

  const person = personResult.data as PersonRecord | null;
  const relationshipRecords =
    (relationshipResult.data ?? []) as unknown as WhakapapaRelationship[];

  return (
    <AppShell title="Person Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Person Record
        </p>

        {personResult.error ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {personResult.error.message}
            </pre>
          </>
        ) : !person ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Person not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No people record exists for this ID. Return to the people
              register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {person.full_name}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This identity record can connect to whakapapa relationships, hui
              attendance, assigned tasks, documents, roles, and future activity
              history.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Record Details</h2>

            <p className="mt-1 text-sm text-stone-400">
              Core fields from the Supabase people table.
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
              href="/whakapapa/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Relationship
            </a>
          </div>
        </div>

        {person ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <tr className="border-t border-stone-800 bg-stone-950">
                  <th className="w-48 px-4 py-4 font-medium text-stone-400">
                    Full Name
                  </th>

                  <td className="px-4 py-4 text-stone-100">
                    {person.full_name}
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-900">
                  <th className="w-48 px-4 py-4 font-medium text-stone-400">
                    Created
                  </th>

                  <td className="px-4 py-4 text-stone-300">
                    {formatDate(person.created_at)}
                  </td>
                </tr>

                <tr className="border-t border-stone-800 bg-stone-950">
                  <th className="w-48 px-4 py-4 font-medium text-stone-400">
                    Record ID
                  </th>

                  <td className="px-4 py-4">
                    <span className="font-mono text-xs text-stone-500">
                      {person.id}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The person record could not be displayed.
            </p>
          </div>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Whakapapa Relationships
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Relationship records where this person appears.
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

        {relationshipResult.error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {relationshipResult.error.message}
            </pre>
          </div>
        ) : relationshipRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No whakapapa relationships yet
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add a relationship record to connect this person into the
              whakapapa layer.
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
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {relationshipRecords.map((relationship) => (
                  <tr
                    key={relationship.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4">
                      <a
                        href={`/people/${relationship.person_a_id}`}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {relationship.person_a?.full_name || "Unknown person"}
                      </a>
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {relationship.relationship_type}
                    </td>

                    <td className="px-4 py-4">
                      <a
                        href={`/people/${relationship.person_b_id}`}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {relationship.person_b?.full_name || "Unknown person"}
                      </a>
                    </td>

                    <td className="px-4 py-4">
                      <a
                        href={`/whakapapa/${relationship.id}`}
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
              Useful pathways connected to this person record.
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
              Return to the full people register.
            </p>
          </a>

          <a
            href="/whakapapa"
            className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
          >
            <h3 className="text-sm font-semibold text-white">Whakapapa</h3>

            <p className="mt-1 text-sm text-stone-400">
              View all relationship records.
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