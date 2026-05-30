import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MaraeRecord = {
  id: string;
  name: string;
  location: string | null;
  status: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function MaraeDetailPage({
  params,
}: MaraeDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("marae_records")
    .select(
      `
      id,
      name,
      location,
      status,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const marae = data as MaraeRecord | null;

  return (
    <AppShell title="Marae Detail" eyebrow="Marae Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/marae"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Marae
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Marae Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {marae?.name || "Marae Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected marae record from the hapū relational infrastructure
          database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !marae ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Marae not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No marae record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the marae_records table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Name
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {marae.name}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Location
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {marae.location || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {marae.status || "active"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {marae.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {marae.updated_at || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Record ID
                </p>
                <p className="mt-3 break-all text-sm text-stone-300">
                  {marae.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}