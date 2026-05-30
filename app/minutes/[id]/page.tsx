import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MinutesDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MinutesRecord = {
  id: string;
  hui_id: string | null;
  title: string;
  summary: string | null;
  full_minutes: string | null;
  recorded_by: string | null;
  approved_status: string | null;
  approved_date: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function MinutesDetailPage({
  params,
}: MinutesDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("minutes")
    .select(
      `
      id,
      hui_id,
      title,
      summary,
      full_minutes,
      recorded_by,
      approved_status,
      approved_date,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const minutes = data as MinutesRecord | null;

  return (
    <AppShell title="Minutes Detail" eyebrow="Minutes Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/minutes"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Minutes
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Minutes Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {minutes?.title || "Minutes Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected minutes record from the hapū relational
          infrastructure database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !minutes ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Minutes not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No minutes record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the minutes table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {minutes.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Recorded By
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {minutes.recorded_by || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Approval Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {minutes.approved_status || "draft"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Approved Date
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {minutes.approved_date || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {minutes.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {minutes.updated_at || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Summary
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {minutes.summary || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Full Minutes
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {minutes.full_minutes || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Record IDs
              </p>

              <div className="mt-4 grid gap-3 text-sm text-stone-300">
                <p>
                  <span className="text-stone-500">Hui ID:</span>{" "}
                  <span className="break-all">{minutes.hui_id || "—"}</span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Record ID
              </p>
              <p className="mt-3 break-all text-sm text-stone-300">
                {minutes.id}
              </p>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}