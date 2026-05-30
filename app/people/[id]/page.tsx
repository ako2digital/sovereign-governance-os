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
    <AppShell title="Person Detail" eyebrow="People Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/people"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to People
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Person Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {person?.full_name || "Person Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected person record from the hapū relational
          infrastructure database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !person ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Person not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No person record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the people table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Full Name
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {person.full_name}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {person.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 md:col-span-2">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Record ID
                </p>
                <p className="mt-3 break-all text-sm text-stone-300">
                  {person.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}