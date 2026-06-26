import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PeopleDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type PersonRecord = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  other_names: string | null;
  email: string | null;
  phone: string | null;
  role_title: string | null;
  affiliation: string | null;
  marae: string | null;
  hapu: string | null;
  iwi: string | null;
  status: string | null;
  sensitivity_level: string | null;
  profile_summary: string | null;
  notes: string | null;
  consent_status: string | null;
  created_at: string | null;
  updated_at: string | null;
};

type KnowledgeRecord = {
  id: string;
  record_type: string;
  title: string | null;
  summary: string | null;
  date_label: string | null;
  source_name: string | null;
  source_url: string | null;
  sensitivity_level: string | null;
  verification_status: string | null;
  created_at: string | null;
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

function isHttpUrl(url: string) {
  return /^https?:\/\//.test(url);
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
      <th className="w-52 px-4 py-4 align-top text-sm font-medium text-[var(--muted-foreground)]">
        {label}
      </th>

      <td className="px-4 py-4 text-sm text-[var(--foreground)]">{children}</td>
    </tr>
  );
}

function SectionPanel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            {title}
          </h2>

          {description ? (
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {description}
            </p>
          ) : null}
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

export default async function PeopleDetailPage({
  params,
}: PeopleDetailPageProps) {
  const { id } = await params;

  const [personResult, relationshipResult, knowledgeResult] = await Promise.all(
    [
      supabase
        .from("people")
        .select(
          `
          id,
          full_name,
          preferred_name,
          other_names,
          email,
          phone,
          role_title,
          affiliation,
          marae,
          hapu,
          iwi,
          status,
          sensitivity_level,
          profile_summary,
          notes,
          consent_status,
          created_at,
          updated_at
        `
        )
        .eq("id", id)
        .maybeSingle(),
      supabase
        .from("whakapapa_relationships")
        .select(
          `
          id,
          person_a_id,
          person_b_id,
          relationship_type,
          created_at,
          person_a:person_a_id ( full_name ),
          person_b:person_b_id ( full_name )
        `
        )
        .or(`person_a_id.eq.${id},person_b_id.eq.${id}`)
        .order("created_at", { ascending: false }),
      supabase
        .from("person_knowledge_records")
        .select(
          `
          id,
          record_type,
          title,
          summary,
          date_label,
          source_name,
          source_url,
          sensitivity_level,
          verification_status,
          created_at
        `
        )
        .eq("person_id", id)
        .order("created_at", { ascending: false }),
    ]
  );

  const person = personResult.data as PersonRecord | null;
  const personError = personResult.error;
  const relationships =
    (relationshipResult.data ?? []) as unknown as WhakapapaRelationship[];
  const relationshipError = relationshipResult.error;
  const knowledgeRecords = (knowledgeResult.data ?? []) as KnowledgeRecord[];
  const knowledgeError = knowledgeResult.error;

  const personName = person?.full_name || "Unknown person";

  return (
    <AppShell title="Person Detail" eyebrow="Whakapapa & People">
      {/* Hero */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Person Record
        </p>

        {personError ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-red-400">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-400">
              {personError.message}
            </pre>
          </>
        ) : !person ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Person not found
            </h1>

            <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
              No person record exists for this ID. Return to the people register
              and select an existing record.
            </p>
          </>
        ) : (
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                {personName}
              </h1>

              {person.preferred_name ? (
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Known as {person.preferred_name}
                </p>
              ) : null}

              {person.role_title || person.affiliation ? (
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {[person.role_title, person.affiliation]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              ) : null}
            </div>

            <Link
              href={`/people/${id}/edit`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              Edit Person
            </Link>
          </div>
        )}
      </section>

      {person ? (
        <>
          {/* Identity */}
          <SectionPanel
            title="Identity Details"
            description="Core name and registry information."
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href="/people"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Back to People
                </Link>

                <Link
                  href="/people/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Person
                </Link>
              </div>
            }
          >
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Full Name" darker>
                    <span className="font-medium">{person.full_name}</span>
                  </FieldRow>

                  <FieldRow label="Preferred Name">
                    {val(person.preferred_name)}
                  </FieldRow>

                  <FieldRow label="Other Names" darker>
                    {val(person.other_names)}
                  </FieldRow>

                  <FieldRow label="Person ID">
                    <span className="font-mono text-xs text-[var(--muted-foreground)]">
                      {person.id}
                    </span>
                  </FieldRow>

                  <FieldRow label="Created" darker>
                    {formatDate(person.created_at)}
                  </FieldRow>

                  <FieldRow label="Last Updated">
                    {formatDate(person.updated_at)}
                  </FieldRow>
                </tbody>
              </table>
            </div>
          </SectionPanel>

          {/* Contact */}
          <SectionPanel title="Contact Details">
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Email" darker>
                    {val(person.email)}
                  </FieldRow>

                  <FieldRow label="Phone">{val(person.phone)}</FieldRow>
                </tbody>
              </table>
            </div>
          </SectionPanel>

          {/* Governance */}
          <SectionPanel
            title="Governance Context"
            description="Role and organisational context."
          >
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Role / Title" darker>
                    {val(person.role_title)}
                  </FieldRow>

                  <FieldRow label="Affiliation">
                    {val(person.affiliation)}
                  </FieldRow>
                </tbody>
              </table>
            </div>
          </SectionPanel>

          {/* Hapū / marae / iwi */}
          <SectionPanel title="Hapū / Marae / Iwi Affiliation">
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Marae" darker>{val(person.marae)}</FieldRow>
                  <FieldRow label="Hapū">{val(person.hapu)}</FieldRow>
                  <FieldRow label="Iwi" darker>{val(person.iwi)}</FieldRow>
                </tbody>
              </table>
            </div>
          </SectionPanel>

          {/* Sensitivity & consent */}
          <SectionPanel title="Sensitivity and Consent">
            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Status" darker>{val(person.status)}</FieldRow>

                  <FieldRow label="Sensitivity Level">
                    {val(person.sensitivity_level)}
                  </FieldRow>

                  <FieldRow label="Consent Status" darker>
                    {val(person.consent_status)}
                  </FieldRow>
                </tbody>
              </table>
            </div>
          </SectionPanel>

          {/* Notes */}
          {person.profile_summary || person.notes ? (
            <SectionPanel title="Notes and Summary">
              <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
                <table className="w-full border-collapse text-left text-sm">
                  <tbody>
                    {person.profile_summary ? (
                      <FieldRow label="Profile Summary" darker>
                        <p className="whitespace-pre-wrap leading-6">
                          {person.profile_summary}
                        </p>
                      </FieldRow>
                    ) : null}

                    {person.notes ? (
                      <FieldRow label="Notes">
                        <p className="whitespace-pre-wrap leading-6">
                          {person.notes}
                        </p>
                      </FieldRow>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </SectionPanel>
          ) : null}
        </>
      ) : null}

      {/* Knowledge archive */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Knowledge Archive
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Stories, kōrero, whakataukī, hui references, and cultural records
              linked to this person.
            </p>
          </div>

          {person ? (
            <Link
              href={`/people/${id}/knowledge/new`}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Add Knowledge Record
            </Link>
          ) : null}
        </div>

        {knowledgeError ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {knowledgeError.message}
            </pre>
          </div>
        ) : knowledgeRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
            <p className="text-sm font-medium text-[var(--foreground)]">
              No knowledge records yet
            </p>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Stories, kōrero, whakataukī, and other cultural records can be
              added here.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {knowledgeRecords.map((record) => (
              <div
                key={record.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-medium uppercase tracking-wide text-[var(--accent)]">
                    {record.record_type.replace(/_/g, " ")}
                  </span>

                  {record.sensitivity_level ? (
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {record.sensitivity_level}
                    </span>
                  ) : null}
                </div>

                {record.title ? (
                  <h3 className="mt-2 text-sm font-semibold text-[var(--foreground)]">
                    {record.title}
                  </h3>
                ) : null}

                {record.summary ? (
                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {record.summary}
                  </p>
                ) : null}

                <div className="mt-3 space-y-1">
                  {record.date_label ? (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Date: {record.date_label}
                    </p>
                  ) : null}

                  {record.source_name ? (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Source: {record.source_name}
                    </p>
                  ) : null}

                  {record.source_url ? (
                    isHttpUrl(record.source_url) ? (
                      <a
                        href={record.source_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-xs text-[var(--accent)] underline-offset-4 hover:underline"
                      >
                        {record.source_url}
                      </a>
                    ) : (
                      <p className="text-xs text-[var(--muted-foreground)]">
                        {record.source_url}
                      </p>
                    )
                  ) : null}

                  {record.verification_status ? (
                    <p className="text-xs text-[var(--muted-foreground)]">
                      Verification: {record.verification_status}
                    </p>
                  ) : null}
                </div>

                <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                  Added {formatDate(record.created_at)}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Whakapapa relationships */}
      {relationshipError ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Whakapapa Relationships
          </h2>

          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-400">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {relationshipError.message}
            </pre>
          </div>
        </section>
      ) : relationships.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Whakapapa Relationships
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Confirmed whakapapa relationship records linked to this person.
              </p>
            </div>

            <span className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted-foreground)]">
              {relationships.length} linked
            </span>
          </div>

          <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">First Person</th>
                  <th className="px-4 py-3 font-medium">Relationship</th>
                  <th className="px-4 py-3 font-medium">Second Person</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {relationships.map((rel) => {
                  const nameA = rel.person_a?.full_name || "Unknown person";
                  const nameB = rel.person_b?.full_name || "Unknown person";

                  return (
                    <tr
                      key={rel.id}
                      className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={`/people/${rel.person_a_id}`}
                          className="font-medium text-[var(--foreground)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
                        >
                          {nameA}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {rel.relationship_type}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={`/people/${rel.person_b_id}`}
                          className="font-medium text-[var(--foreground)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
                        >
                          {nameB}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-[var(--muted-foreground)]">
                        {formatDate(rel.created_at)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={`/whakapapa/${rel.id}`}
                          className="text-sm font-medium text-[var(--foreground)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
                        >
                          View relationship
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}
