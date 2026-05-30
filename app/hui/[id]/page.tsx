import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type HuiDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type HuiRecord = {
  id: string;
  title: string;
  hui_date: string | null;
  location: string | null;
  purpose: string | null;
  agenda: string | null;
  status: string | null;
  related_marae_id: string | null;
  related_whenua_id: string | null;
  related_governance_record_id: string | null;
  created_at: string;
};

export default async function HuiDetailPage({ params }: HuiDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("hui")
    .select(
      `
      id,
      title,
      hui_date,
      location,
      purpose,
      agenda,
      status,
      related_marae_id,
      related_whenua_id,
      related_governance_record_id,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const hui = data as HuiRecord | null;

  return (
    <AppShell title="Hui Detail" eyebrow="Hui Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/hui"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Hui
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Hui Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {hui?.title || "Hui Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected hui record from the hapū relational infrastructure
          database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !hui ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Hui not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No hui record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the hui table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {hui.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Hui Date
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {hui.hui_date || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {hui.status || "planned"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Location
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {hui.location || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {hui.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Record ID
                </p>
                <p className="mt-3 break-all text-sm text-stone-300">
                  {hui.id}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Purpose
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                  {hui.purpose || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Agenda
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                  {hui.agenda || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Record IDs
              </p>

              <div className="mt-4 grid gap-3 text-sm text-stone-300">
                <p>
                  <span className="text-stone-500">Marae ID:</span>{" "}
                  <span className="break-all">
                    {hui.related_marae_id || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">Whenua ID:</span>{" "}
                  <span className="break-all">
                    {hui.related_whenua_id || "—"}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">
                    Governance Record ID:
                  </span>{" "}
                  <span className="break-all">
                    {hui.related_governance_record_id || "—"}
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