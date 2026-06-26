import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhakapapaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

function FieldRow({
  label,
  children,
  darker = false,
}: {
  label: string;
  children: React.ReactNode;
  darker?: boolean;
}) {
  return (
    <tr
      className={`border-t border-[var(--border)] ${
        darker ? "bg-[var(--surface-raised)]" : "bg-[var(--surface)]"
      }`}
    >
      <th className="w-56 px-4 py-4 align-top font-medium text-[var(--muted-foreground)]">
        {label}
      </th>

      <td className="px-4 py-4 text-[var(--foreground)]">{children}</td>
    </tr>
  );
}

export default async function WhakapapaDetailPage({
  params,
}: WhakapapaDetailPageProps) {
  const { id } = await params;

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
    .eq("id", id)
    .maybeSingle();

  const relationship = data as unknown as WhakapapaRelationship | null;

  const firstPersonName =
    relationship?.person_a?.full_name || "Unknown person";

  const secondPersonName =
    relationship?.person_b?.full_name || "Unknown person";

  return (
    <AppShell title="Whakapapa Detail" eyebrow="Whakapapa & People">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          Whakapapa Relationship Record
        </p>

        {error ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {error.message}
            </pre>
          </>
        ) : !relationship ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              Relationship not found
            </h1>

            <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
              No whakapapa relationship exists for this ID. Return to the
              whakapapa register and select an existing relationship record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {firstPersonName} → {secondPersonName}
            </h1>

            <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
              This page displays the selected whakapapa relationship and only
              the records actually linked to it.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Relationship Details
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Confirmed fields from the Supabase whakapapa_relationships table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/whakapapa"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Back to Whakapapa
            </Link>

            <Link
              href="/whakapapa/new"
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Add Relationship
            </Link>
          </div>
        </div>

        {relationship ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="First Person" darker>
                  <Link
                    href={personPath(relationship.person_a_id)}
                    className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {firstPersonName}
                  </Link>
                </FieldRow>

                <FieldRow label="Relationship Type">
                  {relationship.relationship_type}
                </FieldRow>

                <FieldRow label="Second Person" darker>
                  <Link
                    href={personPath(relationship.person_b_id)}
                    className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {secondPersonName}
                  </Link>
                </FieldRow>

                <FieldRow label="Relationship ID">
                  <Link
                    href={relationshipPath(relationship.id)}
                    className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {relationship.id}
                  </Link>
                </FieldRow>

                <FieldRow label="First Person ID" darker>
                  <Link
                    href={personPath(relationship.person_a_id)}
                    className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {relationship.person_a_id}
                  </Link>
                </FieldRow>

                <FieldRow label="Second Person ID">
                  <Link
                    href={personPath(relationship.person_b_id)}
                    className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {relationship.person_b_id}
                  </Link>
                </FieldRow>

                <FieldRow label="Created" darker>
                  {formatDate(relationship.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No relationship record loaded
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              The relationship record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {relationship ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Related Links
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Only records directly connected to this whakapapa relationship
                are shown here.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <Link
              href={personPath(relationship.person_a_id)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
            >
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {firstPersonName}
              </h3>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Open the first person linked to this relationship.
              </p>

              <p className="mt-4 font-mono text-xs text-[var(--muted-foreground)]">
                {relationship.person_a_id}
              </p>
            </Link>

            <Link
              href={personPath(relationship.person_b_id)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
            >
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                {secondPersonName}
              </h3>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Open the second person linked to this relationship.
              </p>

              <p className="mt-4 font-mono text-xs text-[var(--muted-foreground)]">
                {relationship.person_b_id}
              </p>
            </Link>

            <Link
              href={relationshipPath(relationship.id)}
              className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
            >
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Current Relationship
              </h3>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Stay on this relationship detail page.
              </p>

              <p className="mt-4 font-mono text-xs text-[var(--muted-foreground)]">
                {relationship.id}
              </p>
            </Link>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}