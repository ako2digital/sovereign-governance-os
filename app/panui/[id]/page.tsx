import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PanuiDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type PanuiRecord = {
  id: string;
  title: string;
  message: string | null;
  panui_type: string | null;
  related_marae_id: string | null;
  related_whenua_id: string | null;
  related_hui_id: string | null;
  published_date: string | null;
  status: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
};

export default async function PanuiDetailPage({
  params,
}: PanuiDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("panui")
    .select(
      `
      id,
      title,
      message,
      panui_type,
      related_marae_id,
      related_whenua_id,
      related_hui_id,
      published_date,
      status,
      created_by,
      created_at,
      updated_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const panuiRecord = data as PanuiRecord | null;

  return (
    <AppShell title="Pānui Detail" eyebrow="Pānui Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/panui"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Pānui
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Pānui Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {panuiRecord?.title || "Pānui Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected pānui record from the hapū relational infrastructure
          database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !panuiRecord ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Pānui record not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No pānui record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the panui table, with linked related
                marae, whenua, and hui records.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Title
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {panuiRecord.title}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Type
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {panuiRecord.panui_type || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Status
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {panuiRecord.status || "draft"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Published Date
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {panuiRecord.published_date || "—"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {panuiRecord.created_at}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Updated
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {panuiRecord.updated_at || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Message
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {panuiRecord.message || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Records
              </p>

              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Marae
                  </p>

                  {panuiRecord.related_marae_id ? (
                    <a
                      href={`/marae/${panuiRecord.related_marae_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {panuiRecord.related_marae_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Whenua
                  </p>

                  {panuiRecord.related_whenua_id ? (
                    <a
                      href={`/whenua/${panuiRecord.related_whenua_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {panuiRecord.related_whenua_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>

                <div className="rounded-xl border border-stone-800 bg-stone-900 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Related Hui
                  </p>

                  {panuiRecord.related_hui_id ? (
                    <a
                      href={`/hui/${panuiRecord.related_hui_id}`}
                      className="mt-3 block break-all text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {panuiRecord.related_hui_id}
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-stone-300">—</p>
                  )}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-stone-800 bg-stone-900 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created By
                </p>
                <p className="mt-3 break-all text-sm text-stone-300">
                  {panuiRecord.created_by || "—"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Record ID
              </p>
              <p className="mt-3 break-all text-sm text-stone-300">
                {panuiRecord.id}
              </p>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}