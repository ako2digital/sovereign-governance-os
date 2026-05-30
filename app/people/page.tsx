import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PersonRecord = {
  id: string;
  full_name: string;
  created_at: string;
};

const relatedRecordLinks = [
  { label: "Whakapapa", href: "/whakapapa", description: "Relationship links" },
  { label: "Hui", href: "/hui", description: "Attendance and participation" },
  { label: "Tasks", href: "/tasks", description: "Assigned follow-up actions" },
  { label: "Activity", href: "/activity", description: "Record history" },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function PeoplePage() {
  const { data, error } = await supabase
    .from("people")
    .select("id, full_name, created_at")
    .order("created_at", { ascending: false });

  const people = (data ?? []) as PersonRecord[];

  return (
    <AppShell title="People Register" eyebrow="Core Records / People">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <a
                href="/people"
                className="inline-flex rounded-full border border-stone-700 bg-stone-950 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-stone-400 transition hover:border-stone-500 hover:text-white"
              >
                People register
              </a>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Identity records that everything else can connect to.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                People records are the base layer. From here a person can be
                linked to whakapapa, hui attendance, roles, tasks, documents,
                decisions, and activity history.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
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
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60">
            <div className="flex items-center justify-between border-b border-stone-800 px-6 py-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Current records
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {people.length} people recorded
                </h2>
              </div>

              <a
                href="/people/new"
                className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Add record
              </a>
            </div>

            {error ? (
              <div className="p-6">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-300">
                    Supabase error while loading people records.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-red-200/80">
                    {error.message}
                  </p>
                </div>
              </div>
            ) : people.length === 0 ? (
              <div className="p-6">
                <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    No people records yet.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    Add the first person record to begin the identity layer.
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
                    className="group grid gap-4 px-6 py-5 transition hover:bg-stone-900 md:grid-cols-[1fr_180px_120px]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {person.full_name}
                      </h3>

                      <p className="mt-1 break-all font-mono text-xs text-stone-600">
                        {person.id}
                      </p>
                    </div>

                    <div className="text-sm text-stone-500">
                      Created {formatDate(person.created_at)}
                    </div>

                    <div className="text-sm font-semibold text-stone-500 transition group-hover:text-white md:text-right">
                      View →
                    </div>
                  </a>
                ))}
              </div>
            )}
          </section>

          <aside className="grid gap-6">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Register status
              </p>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Total records
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-white">
                    {people.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Database
                  </p>

                  <p className="mt-3 text-sm font-semibold text-green-400">
                    Supabase connected
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-4">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Security
                  </p>

                  <p className="mt-3 text-sm font-semibold text-stone-300">
                    RLS enabled
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <div className="mt-5 grid gap-3">
                {relatedRecordLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
                  >
                    <p className="text-sm font-semibold text-white">
                      {link.label}
                    </p>

                    <p className="mt-1 text-xs text-stone-600">
                      {link.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}