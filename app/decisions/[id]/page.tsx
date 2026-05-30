import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type DecisionDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type DecisionRecord = {
  id: string;
  title: string;
  decision_text: string | null;
  decision_date: string | null;
  hui_id: string | null;
  minutes_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function DecisionDetailPage({
  params,
}: DecisionDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("decisions")
    .select(
      `
      id,
      title,
      decision_text,
      decision_date,
      hui_id,
      minutes_id,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const decision = data as DecisionRecord | null;

  return (
    <AppShell title="Decision Detail" eyebrow="Decisions Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/decisions"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Decisions
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Decision Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {decision?.title || "Decision Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected decision record from the hapū relational
          infrastructure database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !decision ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Decision not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No decision record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the decisions table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {decision.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Decision Date
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {decision.decision_date || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {decision.created_at}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Decision Text
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {decision.decision_text || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Record IDs
              </p>

              <div className="mt-4 grid gap-3 text-sm text-stone-300">
                <p>
                  <span className="text-stone-500">Hui ID:</span>{" "}
                  <span className="break-all">{decision.hui_id || "—"}</span>
                </p>

                <p>
                  <span className="text-stone-500">Minutes ID:</span>{" "}
                  <span className="break-all">
                    {decision.minutes_id || "—"}
                  </span>
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {decision.updated_at || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Record ID
                </p>
                <p className="mt-3 break-all text-sm text-stone-300">
                  {decision.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}