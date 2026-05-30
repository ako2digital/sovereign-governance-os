import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PersonRecord = {
  id: string;
  full_name: string;
  created_at: string;
};

export default async function PeoplePage() {
  const { data, error } = await supabase
    .from("people")
    .select(
      `
      id,
      full_name,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  const peopleRecords = (data ?? []) as PersonRecord[];

  return (
    <AppShell title="People" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          People Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">People</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage people records that can later connect to whakapapa, documents,
          tasks, governance records, and activity.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              People Register
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase people table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {peopleRecords.length} records
            </div>

            <a
              href="/people/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Person
            </a>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : peopleRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No people records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first person record to begin testing the people register.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Full Name</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                </tr>
              </thead>

              <tbody>
                {peopleRecords.map((person) => (
                  <tr
                    key={person.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4">
                      <a
                        href={`/people/${person.id}`}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {person.full_name}
                      </a>
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {person.created_at}
                    </td>
                    <td className="px-4 py-4">
                      <span className="break-all text-stone-500">
                        {person.id}
                      </span>
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