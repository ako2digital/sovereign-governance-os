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
    .select("id, full_name, created_at")
    .order("created_at", { ascending: false });

  const people = (data ?? []) as PersonRecord[];

  return (
    <AppShell title="People Register" eyebrow="Core Records / People">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Live register
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            People are the base layer of the system.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-400">
            This register holds the first identity records that future modules
            can connect to: whakapapa relationships, whenua records, marae
            links, governance roles, documents, hui, decisions, and activity.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/people/new"
              className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Person
            </a>

            <a
              href="/whakapapa"
              className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              View Whakapapa
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900/40 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Register status
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Total records
              </div>
              <div className="mt-3 text-4xl font-semibold text-white">
                {people.length}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Database
              </div>
              <div className="mt-3 text-lg font-semibold text-green-400">
                Supabase connected
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Security
              </div>
              <div className="mt-3 text-lg font-semibold text-stone-300">
                RLS enabled
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <section className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
          <p className="font-semibold text-red-300">
            Supabase error while loading people records.
          </p>
          <p className="mt-3 text-sm leading-7 text-red-200/80">
            {error.message}
          </p>
        </section>
      ) : (
        <section className="mt-8 overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60">
          <div className="flex items-center justify-between border-b border-stone-800 px-6 py-5">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Current People Records
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Live records from the Supabase people table.
              </p>
            </div>

            <a
              href="/people/new"
              className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Add record
            </a>
          </div>

          {people.length === 0 ? (
            <div className="p-8">
              <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                <h3 className="text-xl font-semibold text-white">
                  No people records yet.
                </h3>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Add the first person record to begin proving the base register.
                </p>

                <a
                  href="/people/new"
                  className="mt-6 inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add First Person
                </a>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-stone-800">
              {people.map((person) => (
                <a
                  key={person.id}
                  href={`/people/${person.id}`}
                  className="group grid gap-4 px-6 py-5 transition hover:bg-stone-900 lg:grid-cols-[1fr_220px_120px]"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {person.full_name}
                    </h3>

                    <p className="mt-1 font-mono text-xs text-stone-600">
                      ID: {person.id}
                    </p>
                  </div>

                  <div className="text-sm text-stone-500">
                    Created{" "}
                    {new Date(person.created_at).toLocaleDateString("en-NZ", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>

                  <div className="text-sm font-semibold text-stone-500 transition group-hover:text-white">
                    View →
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}