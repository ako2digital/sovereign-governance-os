import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

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

function formatValue(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value;
}

function whenuaPath(id: string) {
  return `/whenua/${id}`;
}

export default async function WhenuaPage() {
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
    .order("created_at", { ascending: false });

  const whenuaRecords = (data ?? []) as WhenuaRecord[];

  return (
    <AppShell title="Whenua" eyebrow="Hapū, Marae & Whenua">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Hapū, Marae & Whenua
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Whenua</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Land records, legal descriptions, and evidence for every block of
          land connected to this organisation — Māori freehold, general land,
          reserves, and customary interests. Whenua records are foundational to
          mandate evidence: they show what land is at stake and what governance process
          relates to it.
        </p>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            What belongs here
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Block names and numbers, legal descriptions, boundaries, land history, current use,
            environmental records, council records, DOC reports, science reports, maps and plans,
            and whenua-related governance records. Attach governance instruments, survey plans,
            environmental assessments, and funding applications as file references. Whenua evidence
            is critical for resource consent, council engagement, and funding applications.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Whenua Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {whenuaRecords.length} {whenuaRecords.length === 1 ? "block" : "blocks"} on record
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {whenuaRecords.length} records
            </div>

            <Link
              href="/whenua/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Whenua
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : whenuaRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No whenua records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first whenua record to begin building the land record
              layer.
            </p>

            <div className="mt-5">
              <Link
                href="/whenua/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Whenua
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Block</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">External Ref</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {whenuaRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <p className="font-medium text-[var(--foreground)]">
                        {record.title || "Untitled whenua record"}
                      </p>

                      <p className="mt-1 font-mono text-xs text-[var(--muted-foreground)]">
                        {record.id}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.block_name)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.location)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.external_reference)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.sensitivity_level)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={whenuaPath(record.id)}
                        className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        View record
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}

