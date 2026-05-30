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
      person_a:person_a_id(full_name),
      person_b:person_b_id(full_name)
    `
    )
    .eq("id", id)
    .maybeSingle();

  const relationship = data as unknown as WhakapapaRelationship | null;

  return (
    <AppShell
      title="Whakapapa Relationship"
      eyebrow="Core Records / Relationship Detail"
    >
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/whakapapa"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Whakapapa
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Relationship record
          </p>

          {error ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-red-300 md:text-5xl">
                Relationship could not be loaded.
              </h1>

              <p className="mt-5 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </>
          ) : !relationship ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Relationship not found.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-400">
                No whakapapa relationship exists for this ID. Return to the
                whakapapa register and select an existing relationship.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                <a
                  href={`/people/${relationship.person_a_id}`}
                  className="underline decoration-stone-600 underline-offset-8 transition hover:text-stone-300 hover:decoration-stone-300"
                >
                  {relationship.person_a?.full_name ?? "Unknown person"}
                </a>

                <span className="text-stone-500"> → </span>

                <a
                  href={`/people/${relationship.person_b_id}`}
                  className="underline decoration-stone-600 underline-offset-8 transition hover:text-stone-300 hover:decoration-stone-300"
                >
                  {relationship.person_b?.full_name ?? "Unknown person"}
                </a>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-400">
                This relationship connects two people records inside the
                whakapapa layer. Each name links directly back to the person
                record it belongs to.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`/people/${relationship.person_a_id}`}
                  className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  View {relationship.person_a?.full_name ?? "first person"}
                </a>

                <a
                  href={`/people/${relationship.person_b_id}`}
                  className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  View {relationship.person_b?.full_name ?? "second person"}
                </a>

                <a
                  href="/whakapapa"
                  className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  Return to Whakapapa
                </a>
              </div>
            </>
          )}
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900/40 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Relationship metadata
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Status
              </div>

              <div className="mt-3 text-lg font-semibold text-green-400">
                {relationship ? "Loaded" : "Unavailable"}
              </div>
            </div>

            {relationship ? (
              <>
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    First person ID
                  </div>

                  <a
                    href={`/people/${relationship.person_a_id}`}
                    className="mt-3 block break-all font-mono text-sm text-stone-300 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                  >
                    {relationship.person_a_id}
                  </a>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Second person ID
                  </div>

                  <a
                    href={`/people/${relationship.person_b_id}`}
                    className="mt-3 block break-all font-mono text-sm text-stone-300 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                  >
                    {relationship.person_b_id}
                  </a>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Relationship type
                  </div>

                  <div className="mt-3 text-lg font-semibold uppercase tracking-wide text-stone-300">
                    {relationship.relationship_type}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Created
                  </div>

                  <div className="mt-3 text-lg font-semibold text-stone-300">
                    {new Date(relationship.created_at).toLocaleDateString(
                      "en-NZ",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </div>
                </div>
              </>
            ) : null}

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Relationship record ID
              </div>

              <div className="mt-3 break-all font-mono text-sm text-stone-300">
                {id}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Database
              </div>

              <div className="mt-3 text-lg font-semibold text-stone-300">
                Supabase whakapapa_relationships table
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}