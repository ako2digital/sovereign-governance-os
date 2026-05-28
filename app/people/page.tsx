import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type Person = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  visibility_status: string | null;
  created_at: string;
};

export default async function PeoplePage() {
  const { data, error } = await supabase
    .from("people")
    .select(
      "id, full_name, preferred_name, email, phone, notes, visibility_status, created_at"
    )
    .order("created_at", { ascending: false });

  const people = (data ?? []) as Person[];

  return (
    <AppShell title="People" eyebrow="MVP Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          People Records
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">People</h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage people connected to whakapapa, whenua, hui, documents,
          decisions, tasks, and activity history.
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
              {people.length} records
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
        ) : people.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No people records yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Add the first person in Supabase to begin building the relational
              record base.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Full name</th>
                  <th className="px-4 py-3 font-medium">Preferred name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Visibility</th>
                </tr>
              </thead>

              <tbody>
                {people.map((person) => (
                  <tr
                    key={person.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {person.full_name}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {person.preferred_name || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {person.email || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {person.phone || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {person.visibility_status || "private"}
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
