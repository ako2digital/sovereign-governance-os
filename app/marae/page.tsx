import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  description?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
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

function maraePath(id: string) {
  return `/marae/${id}`;
}

function getMaraeName(record: MaraeRecord) {
  return record.name || record.title || "Untitled marae record";
}

export default async function MaraePage() {
  const { data, error } = await supabase
    .from("marae_records")
    .select("*")
    .order("created_at", { ascending: false });

  const maraeRecords = (data ?? []) as MaraeRecord[];

  return (
    <AppShell title="Marae" eyebrow="Hapū, Marae & Whenua">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Hapū, Marae & Whenua
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Marae</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Institutional profiles for each marae — the living centre of hapū
          identity, tikanga, and governance. Marae records anchor the governance chain to
          its physical and cultural place, linking to whenua, trustees, hui, facilities,
          development needs, and supporting documents.
        </p>

        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            What belongs here
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Marae profile, hapū and iwi connections, trustees and governance roles, facilities and
            infrastructure, hui held there, development needs, related documents and evidence.
            Note: Marae is a place and institution. Hapū is a collective identity and governance body —
            a dedicated Hapū register is planned as a future core register.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Marae Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {maraeRecords.length} {maraeRecords.length === 1 ? "profile" : "profiles"} on record
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {maraeRecords.length} records
            </div>

            <Link
              href="/marae/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Marae
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : maraeRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No marae records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first marae record to begin building the marae layer.
            </p>

            <div className="mt-5">
              <Link
                href="/marae/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Marae
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {maraeRecords.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={maraePath(record.id)}
                        className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                      >
                        {getMaraeName(record)}
                      </Link>
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.location)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatValue(record.status)}
                    </td>

                    <td className="px-4 py-4 text-[var(--foreground)]">
                      {formatDate(record.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={maraePath(record.id)}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:underline"
                      >
                        {record.id}
                      </Link>
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={maraePath(record.id)}
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
