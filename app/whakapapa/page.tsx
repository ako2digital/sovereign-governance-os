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

const relatedRecordLinks = [
  {
    label: "People Register",
    href: "/people",
    description: "The identity records used in whakapapa links.",
  },
  {
    label: "Whenua",
    href: "/whenua",
    description: "Future whenua connections through people and whakapapa.",
  },
  {
    label: "Documents",
    href: "/documents",
    description: "Future source records, evidence, and supporting files.",
  },
  {
    label: "Activity",
    href: "/activity",
    description: "Future audit trail for relationship changes.",
  },
];

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
      person_a:person_a_id(full_name),
      person_b:person_b_id(full_name)
    `
    )
    .order("created_at", { ascending: false });

  const relationships = (data ?? []) as unknown as WhakapapaRelationship[];

  return (
    <AppShell title="Whakapapa" eyebrow="Core Records / Relationships">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <a
                href="/whakapapa"
                className="inline-flex rounded-full border border-stone-700 bg-stone-950 px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-stone-400 transition hover:border-stone-500 hover:text-white"
              >
                Relationship register
              </a>

              <h1 className="mt-6 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Whakapapa links people into relational structure.
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                A whakapapa record connects one person to another. These links
                become the relationship layer for identity, history, authority,
                whenua, documents, and future governance context.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="/whakapapa/new"
                className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add Relationship
              </a>

              <a
                href="/people"
                className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                View People
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="overflow-hidden rounded-3xl border border-stone-800 bg-stone-900/60">
            <div className="flex items-center justify-between border-b border-stone-800 px-6 py-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Current relationships
                </p>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                  {relationships.length} whakapapa links recorded
                </h2>
              </div>

              <a
                href="/whakapapa/new"
                className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
              >
                Add record
              </a>
            </div>

            {error ? (
              <div className="p-6">
                <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-300">
                    Supabase error while loading whakapapa records.
                  </p>

                  <p className="mt-3 text-sm leading-7 text-red-200/80">
                    {error.message}
                  </p>
                </div>
              </div>
            ) : relationships.length === 0 ? (
              <div className="p-6">
                <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                  <h3 className="text-xl font-semibold text-white">
                    No whakapapa relationships yet.
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-stone-500">
                    Add the first relationship to begin the relational layer.
                  </p>

                  <a
                    href="/whakapapa/new"
                    className="mt-6 inline-flex rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                  >
                    Add First Relationship
                  </a>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-stone-800">
                {relationships.map((relationship) => (
                  <div
                    key={relationship.id}
                    className="grid gap-4 px-6 py-5 transition hover:bg-stone-900 lg:grid-cols-[1fr_180px_170px]"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        <a
                          href={`/people/${relationship.person_a_id}`}
                          className="underline decoration-stone-700 underline-offset-4 transition hover:text-stone-300 hover:decoration-stone-300"
                        >
                          {relationship.person_a?.full_name ?? "Unknown person"}
                        </a>

                        <span className="text-stone-500"> → </span>

                        <a
                          href={`/people/${relationship.person_b_id}`}
                          className="underline decoration-stone-700 underline-offset-4 transition hover:text-stone-300 hover:decoration-stone-300"
                        >
                          {relationship.person_b?.full_name ?? "Unknown person"}
                        </a>
                      </h3>

                      <p className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                        {relationship.relationship_type}
                      </p>
                    </div>

                    <div className="text-sm text-stone-500">
                      Created {formatDate(relationship.created_at)}
                    </div>

                    <a
                      href={`/whakapapa/${relationship.id}`}
                      className="text-sm font-semibold text-stone-500 transition hover:text-white lg:text-right"
                    >
                      View relationship →
                    </a>
                  </div>
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
                    Total relationships
                  </p>

                  <p className="mt-3 text-3xl font-semibold text-white">
                    {relationships.length}
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
                    Record type
                  </p>

                  <p className="mt-3 text-sm font-semibold text-stone-300">
                    Person-to-person relationship
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

                    <p className="mt-1 text-xs leading-5 text-stone-600">
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