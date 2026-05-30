import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhenuaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type WhenuaRecord = {
  id: string;
  title: string;
  block_name: string | null;
  location: string | null;
  legal_description: string | null;
  external_reference: string | null;
  historical_notes: string | null;
  status: string | null;
  sensitivity_level: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function WhenuaDetailPage({
  params,
}: WhenuaDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("whenua_records")
    .select(
      `
      id,
      title,
      block_name,
      location,
      legal_description,
      external_reference,
      historical_notes,
      status,
      sensitivity_level,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const whenua = data as WhenuaRecord | null;

  return (
    <AppShell title="Whenua Detail" eyebrow="Whenua Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/whenua"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Whenua
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Whenua Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {whenua?.title || "Whenua Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected whenua record from the hapū relational
          infrastructure database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !whenua ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Whenua not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No whenua record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the whenua_records table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {whenua.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Block Name
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {whenua.block_name || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Location
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {whenua.location || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {whenua.status || "active"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Sensitivity
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {whenua.sensitivity_level || "standard"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  External Reference
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {whenua.external_reference || "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Legal Description
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                  {whenua.legal_description || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Historical Notes
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                  {whenua.historical_notes || "—"}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {whenua.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {whenua.updated_at || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Record ID
                </p>
                <p className="mt-3 break-all text-sm text-stone-300">
                  {whenua.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}