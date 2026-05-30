import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type GovernanceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type GovernanceRecord = {
  id: string;
  title: string;
  record_type: string | null;
  summary: string | null;
  status: string | null;
  related_marae_id: string | null;
  related_whenua_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function GovernanceDetailPage({
  params,
}: GovernanceDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("governance_records")
    .select(
      `
      id,
      title,
      record_type,
      summary,
      status,
      related_marae_id,
      related_whenua_id,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const governanceRecord = data as GovernanceRecord | null;

  return (
    <AppShell title="Governance Detail" eyebrow="Governance Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/governance"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Governance
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Governance Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {governanceRecord?.title || "Governance Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected governance record from the hapū relational
          infrastructure database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !governanceRecord ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Governance record not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No governance record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the governance_records table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {governanceRecord.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Record Type
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {governanceRecord.record_type || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {governanceRecord.status || "active"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {governanceRecord.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {governanceRecord.updated_at || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Record ID
                </p>
                <p className="mt-3 break-all text-sm text-stone-300">
                  {governanceRecord.id}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Summary
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {governanceRecord.summary || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Record IDs
              </p>

              <div className="mt-4 grid gap-3 text-sm text-stone-300">
                <p>
                  <span className="text-stone-500">Marae ID:</span>{" "}
                  <span className="break-all">
                    {governanceRecord.related_marae_id || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">Whenua ID:</span>{" "}
                  <span className="break-all">
                    {governanceRecord.related_whenua_id || "—"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}