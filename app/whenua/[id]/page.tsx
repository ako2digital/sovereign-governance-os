import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhenuaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  legal_description: string | null;
  external_reference: string | null;
  historical_notes: string | null;
  status: string | null;
  sensitivity_level: string | null;
  created_at: string | null;
};

function formatDate(date?: string | null) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatValue(value?: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return value;
}

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
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const record = data as WhenuaRecord | null;

  return (
    <AppShell title="Whenua Detail" eyebrow="Core Records / Whenua Detail">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/whenua"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Whenua Records
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Whenua record
          </p>

          {error ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-red-300 md:text-5xl">
                Whenua record could not be loaded.
              </h1>

              <p className="mt-5 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </>
          ) : !record ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Whenua record not found.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-400">
                No whenua record exists for this ID. Return to the whenua
                register and select an existing record.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-6xl">
                {record.title || "Untitled whenua record"}
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-400">
                This whenua record is part of the land and place layer. It can
                later connect to people, whakapapa, marae, legal documents,
                historical evidence, governance decisions, maps, and activity
                history.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="/whenua"
                  className="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Return to Whenua Register
                </a>

                <a
                  href="/documents"
                  className="rounded-full border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                >
                  View Documents
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
                {record ? formatValue(record.status) : "Unavailable"}
              </div>
            </div>

            {record ? (
              <>
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Sensitivity
                  </div>

                  <div className="mt-3 text-lg font-semibold text-stone-300">
                    {formatValue(record.sensitivity_level)}
                  </div>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Created
                  </div>

                  <div className="mt-3 text-lg font-semibold text-stone-300">
                    {formatDate(record.created_at)}
                  </div>
                </div>
              </>
            ) : null}

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Record ID
              </div>

              <div className="mt-3 break-all font-mono text-sm text-stone-300">
                {id}
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                Database
              </div>

              <div className="mt-3 text-lg font-semibold text-stone-300">
                Supabase whenua_records table
              </div>
            </div>
          </div>
        </div>
      </section>

      {record ? (
        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
              Place details
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Block name
                </div>

                <div className="mt-3 text-lg font-semibold text-stone-300">
                  {formatValue(record.block_name)}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Location
                </div>

                <div className="mt-3 text-lg font-semibold text-stone-300">
                  {formatValue(record.location)}
                </div>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <div className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  External reference
                </div>

                <div className="mt-3 break-all text-lg font-semibold text-stone-300">
                  {formatValue(record.external_reference)}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
              Legal description
            </p>

            <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-stone-400">
              {formatValue(record.legal_description)}
            </p>
          </div>

          <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8 lg:col-span-2">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
              Historical notes
            </p>

            <p className="mt-6 whitespace-pre-wrap text-sm leading-7 text-stone-400">
              {formatValue(record.historical_notes)}
            </p>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}