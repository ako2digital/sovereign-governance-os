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

export default async function PeopleDetailPage({
  params,
}: PeopleDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("people")
    .select(
      `
      id,
      full_name,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const person = data as PersonRecord | null;

  return (
    <AppShell title="Person Detail" eyebrow="Core Records / People">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/people"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to People Register
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Person record
          </p>

          {error ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-red-300 md:text-5xl">
                Record could not be loaded.
              </h1>

              <p className="mt-5 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </>
          ) : !person ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Person not found.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-400">
                No people record exists for this ID. Return to the register and
                select an existing record.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {person.full_name}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-400">
                This record is an identity anchor inside the relational system.
                Future layers can connect this person to whakapapa,
                whenua, marae, governance roles, hui, documents, decisions,
                and activity history.
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
                  Return to Register
                </a>
              </div>
            </>
          )}
        </div>

        <div className="rounded-3xl border border-stone-800 bg-stone-900/40 p-8">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Record metadata
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Status
              </div>

              <div className="mt-3 text-lg font-semibold text-green-400">
                {person ? "Loaded" : "Unavailable"}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Record ID
              </div>

              <div className="mt-3 break-all font-mono text-sm text-stone-300">
                {id}
              </div>
            </div>

            {person ? (
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Created
                </div>

                <div className="mt-3 text-lg font-semibold text-stone-300">
                  {new Date(person.created_at).toLocaleDateString("en-NZ", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ) : null}

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Database
              </div>

              <div className="mt-3 text-lg font-semibold text-stone-300">
                Supabase people table
              </div>
            </div>
          </div>
        </div>
      </section>
    </AppShell>
  );
}