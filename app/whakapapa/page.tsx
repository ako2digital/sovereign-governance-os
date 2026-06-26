import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type LinkedPerson = {
  full_name: string;
};

type WhakapapaRelationship = {
  id: string;
  person_a_id: string;
  person_b_id: string;
  relationship_type: string;
  created_at: string | null;
  person_a: LinkedPerson | null;
  person_b: LinkedPerson | null;
};

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

function personPath(id: string) {
  return `/people/${id}`;
}

function relationshipPath(id: string) {
  return `/whakapapa/${id}`;
}

export default async function WhakapapaPage() {
  const { data, error } = await supabase
    .from("whakapapa_relationships")
    .select(
      `
      id,
      person_a_id,
      person_b_id,
      relationship_type,
      created_at,
      person_a:person_a_id (
        full_name
      ),
      person_b:person_b_id (
        full_name
      )
    `
    )
    .order("created_at", { ascending: false });

  const relationshipRecords =
    (data ?? []) as unknown as WhakapapaRelationship[];

  return (
    <AppShell title="Whakapapa" eyebrow="Core Records">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Whakapapa Register
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          Whakapapa
        </h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Manage relationship records between people. Each whakapapa record
          links two identity records together and can later support verification,
          whakapapa mapping, and related record history.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Whakapapa Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Live records pulled from the Supabase whakapapa_relationships
              table.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {relationshipRecords.length} records
            </div>

            <Link
              href="/whakapapa/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Relationship
            </Link>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : relationshipRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No whakapapa records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first whakapapa relationship to begin building the
              relationship layer.
            </p>

            <div className="mt-5">
              <Link
                href="/whakapapa/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Relationship
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">First Person</th>
                  <th className="px-4 py-3 font-medium">Relationship</th>
                  <th className="px-4 py-3 font-medium">Second Person</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Record ID</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {relationshipRecords.map((record) => {
                  const firstPersonName =
                    record.person_a?.full_name || "Unknown person";

                  const secondPersonName =
                    record.person_b?.full_name || "Unknown person";

                  return (
                    <tr
                      key={record.id}
                      className="border-t border-[var(--border)] bg-[var(--surface)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={personPath(record.person_a_id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                        >
                          {firstPersonName}
                        </Link>
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={relationshipPath(record.id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {record.relationship_type || "Relationship"}
                        </Link>
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={personPath(record.person_b_id)}
                          className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                        >
                          {secondPersonName}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--foreground)]">
                        {formatDate(record.created_at)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={relationshipPath(record.id)}
                          className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                        >
                          {record.id}
                        </Link>
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={relationshipPath(record.id)}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:underline"
                        >
                          View record
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}
