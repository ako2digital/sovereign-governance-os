import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PersonRecord = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  role_title: string | null;
  affiliation: string | null;
  marae: string | null;
  hapu: string | null;
  iwi: string | null;
  status: string | null;
  sensitivity_level: string | null;
  created_at: string | null;
};

function formatDate(date?: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function val(v?: string | null) {
  return v || "—";
}

function affiliationSummary(person: PersonRecord) {
  return (
    [person.hapu, person.marae, person.iwi].filter(Boolean).join(" · ") || "—"
  );
}

export default async function PeoplePage() {
  const { data, error } = await supabase
    .from("people")
    .select(
      `
      id,
      full_name,
      preferred_name,
      role_title,
      affiliation,
      marae,
      hapu,
      iwi,
      status,
      sensitivity_level,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  const peopleRecords = (data ?? []) as PersonRecord[];

  return (
    <AppShell title="People" eyebrow="Core Records">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          People Register
        </p>

        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          People
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          Identity records for people connected to whakapapa, hui, tasks,
          governance roles, and knowledge archives.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              People Register
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {peopleRecords.length}{" "}
              {peopleRecords.length === 1 ? "record" : "records"}
            </p>
          </div>

          <Link
            href="/people/new"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Person
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : peopleRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No people records yet
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Add the first person record to begin building the registry.
            </p>

            <div className="mt-5">
              <Link
                href="/people/new"
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add First Person
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Role / Title</th>
                  <th className="px-4 py-3 font-medium">Affiliation</th>
                  <th className="px-4 py-3 font-medium">Hapū / Marae / Iwi</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Sensitivity</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {peopleRecords.map((person) => (
                  <tr
                    key={person.id}
                    className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={`/people/${person.id}`}
                        className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                      >
                        {person.full_name || "Unnamed person"}
                      </Link>

                      {person.preferred_name ? (
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {person.preferred_name}
                        </p>
                      ) : null}
                    </td>

                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {val(person.role_title)}
                    </td>

                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {val(person.affiliation)}
                    </td>

                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {affiliationSummary(person)}
                    </td>

                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {val(person.status)}
                    </td>

                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {val(person.sensitivity_level)}
                    </td>

                    <td className="px-4 py-4 text-[var(--muted-foreground)]">
                      {formatDate(person.created_at)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={`/people/${person.id}`}
                        className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
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
