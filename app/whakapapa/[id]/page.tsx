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

const relatedRecordLinks = [
  {
    label: "People Register",
    description: "Open the base identity register.",
    href: "/people",
  },
  {
    label: "Whenua",
    description: "Future whenua connections through whakapapa lines.",
    href: "/whenua",
  },
  {
    label: "Documents",
    description: "Future source records, evidence, and supporting files.",
    href: "/documents",
  },
  {
    label: "Activity",
    description: "Future audit trail for this relationship record.",
    href: "/activity",
  },
];

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
      <section className="grid gap-6">
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

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
                No whakapapa relationship exists for this ID. Return to the
                whakapapa register and select an existing relationship.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                <a
                  href={`/people/${relationship.person_a_id}`}
                  className="underline decoration-stone-700 underline-offset-8 transition hover:text-stone-300 hover:decoration-stone-300"
                >
                  {relationship.person_a?.full_name ?? "Unknown person"}
                </a>

                <span className="text-stone-500"> → </span>

                <a
                  href={`/people/${relationship.person_b_id}`}
                  className="underline decoration-stone-700 underline-offset-8 transition hover:text-stone-300 hover:decoration-stone-300"
                >
                  {relationship.person_b?.full_name ?? "Unknown person"}
                </a>
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                This record connects two people inside the whakapapa layer. Each
                person name links directly back to the identity record it belongs
                to.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={`/people/${relationship.person_a_id}`}
                  className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  View first person
                </a>

                <a
                  href={`/people/${relationship.person_b_id}`}
                  className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  View second person
                </a>

                <a
                  href="/whakapapa/new"
                  className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  Add another relationship
                </a>
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <div className="border-b border-stone-800 pb-5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Core details
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Relationship fields
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  First person
                </p>

                {relationship ? (
                  <a
                    href={`/people/${relationship.person_a_id}`}
                    className="mt-3 block text-lg font-semibold text-stone-200 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                  >
                    {relationship.person_a?.full_name ?? "Unknown person"}
                  </a>
                ) : (
                  <p className="mt-3 text-lg font-semibold text-stone-500">
                    Not available
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Second person
                </p>

                {relationship ? (
                  <a
                    href={`/people/${relationship.person_b_id}`}
                    className="mt-3 block text-lg font-semibold text-stone-200 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                  >
                    {relationship.person_b?.full_name ?? "Unknown person"}
                  </a>
                ) : (
                  <p className="mt-3 text-lg font-semibold text-stone-500">
                    Not available
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Relationship type
                </p>

                <p className="mt-3 text-lg font-semibold uppercase tracking-wide text-stone-200">
                  {relationship?.relationship_type ?? "Not available"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Created
                </p>

                <p className="mt-3 text-lg font-semibold text-stone-200">
                  {relationship
                    ? formatDate(relationship.created_at)
                    : "Not available"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 md:col-span-2">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Relationship record ID
                </p>

                <p className="mt-3 break-all font-mono text-sm text-stone-300">
                  {id}
                </p>
              </div>

              {relationship ? (
                <>
                  <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                      First person ID
                    </p>

                    <a
                      href={`/people/${relationship.person_a_id}`}
                      className="mt-3 block break-all font-mono text-sm text-stone-300 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                    >
                      {relationship.person_a_id}
                    </a>
                  </div>

                  <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                    <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                      Second person ID
                    </p>

                    <a
                      href={`/people/${relationship.person_b_id}`}
                      className="mt-3 block break-all font-mono text-sm text-stone-300 underline decoration-stone-700 underline-offset-4 transition hover:text-white hover:decoration-white"
                    >
                      {relationship.person_b_id}
                    </a>
                  </div>
                </>
              ) : null}
            </div>
          </section>

          <aside className="grid gap-6">
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

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Activity
              </p>

              <div className="mt-5 rounded-2xl border border-stone-800 bg-stone-950 p-4">
                <p className="text-sm font-semibold text-white">
                  Relationship record viewed
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-600">
                  This models the future activity log for this whakapapa
                  relationship.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}