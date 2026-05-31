import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type GovernanceRecord = {
  id: string;
  title: string | null;
  record_type: string | null;
  summary: string | null;
  status: string | null;
  effective_date: string | null;
  related_marae_id: string | null;
  related_whenua_id: string | null;
  created_at: string | null;
};

function formatValue(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function governancePath(id: string) {
  return `/governance/${id}`;
}

export default async function GovernancePage() {
  const { data, error } = await supabase
    .from("governance_records")
    .select(
      `
      id,
      title,
      record_type,
      summary,
      status,
      effective_date,
      related_marae_id,
      related_whenua_id,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  const governanceRecords = (data ?? []) as GovernanceRecord[];

  return (
    <AppShell title="Governance" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Governance Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Governance
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Manage governance records, mandates, authority records, status,
          effective dates, summaries, and confirmed links to whenua or marae
          records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Governance Register
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Live records pulled from the Supabase governance_records table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {governanceRecords.length} records
            </div>

            <Link
              href="/governance/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Governance
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : governanceRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No governance records yet
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add the first governance record to begin building the authority
              and decision-support layer.
            </p>

            <div className="mt-5">
              <Link
                href="/governance/new"
                className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add First Governance Record
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full min-w-[1060px] border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Effective Date</th>
                  <th className="px-4 py-3 font-medium">Related Marae</th>
                  <th className="px-4 py-3 font-medium">Related Whenua</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {governanceRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={governancePath(record.id)}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.title || "Untitled governance record"}
                      </Link>

                      {record.summary ? (
                        <p className="mt-1 line-clamp-2 max-w-md text-xs leading-5 text-stone-500">
                          {record.summary}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.record_type)}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatDate(record.effective_date)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(record.related_marae_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-mono text-xs text-stone-500">
                        {formatValue(record.related_whenua_id)}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={governancePath(record.id)}
                        className="font-mono text-xs text-stone-500 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={governancePath(record.id)}
                        className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
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