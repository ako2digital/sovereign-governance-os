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
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Relational layer
          </p>

          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Whakapapa connects records into living structure.
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-stone-400">
            This module proves the first relationship layer. It connects people
            records together so the system can move beyond isolated entries and
            begin forming relational infrastructure.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
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

        <div className="rounded-3xl border border-stone-800 bg-stone-900/40 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Relationship status
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Total relationships
              </div>

              <div className="mt-3 text-4xl font-semibold text-white">
                {relationships.length}
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
                Record type
              </div>

              <div className="mt-3 text-lg font-semibold text-stone-300">
                Person-to-person relationship
              </div>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <section className="mt-8 rounded-3xl border border-red-500/30 bg-red-500/10 p-8">
          <p className="font-semibold text-red-300">
            Supabase error while loading whakapapa records.
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
                Current Whakapapa Relationships
              </h2>

              <p className="mt-1 text-sm text-stone-500">
                Live records from the Supabase whakapapa_relationships table.
              </p>
            </div>

            <a
              href="/whakapapa/new"
              className="rounded-full border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Add relationship
            </a>
          </div>

          {relationships.length === 0 ? (
            <div className="p-8">
              <div className="rounded-3xl border border-dashed border-stone-700 bg-stone-950 p-8 text-center">
                <h3 className="text-xl font-semibold text-white">
                  No whakapapa relationships yet.
                </h3>

                <p className="mt-3 text-sm leading-7 text-stone-500">
                  Add the first relationship to begin proving the relational
                  layer.
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
                  className="grid gap-4 px-6 py-5 transition hover:bg-stone-900 lg:grid-cols-[1fr_220px_170px]"
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
                    Created{" "}
                    {new Date(relationship.created_at).toLocaleDateString(
                      "en-NZ",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>

                  <a
                    href={`/whakapapa/${relationship.id}`}
                    className="text-sm font-semibold text-stone-500 transition hover:text-white"
                  >
                    View relationship →
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
}