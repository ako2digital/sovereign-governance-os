import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue, formatPersonName } from "@/lib/utils";

type MaraeDetailPageProps = {
  params: Promise<{ id: string }>;
};

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

type GovernanceRecord = {
  id: string;
  title: string | null;
  record_type: string | null;
  summary: string | null;
  status: string | null;
  effective_date: string | null;
  created_at: string | null;
};

type RoleTerm = {
  id: string;
  role_title: string;
  role_type: string | null;
  status: string;
  appointment_method: string | null;
  term_start_date: string | null;
  term_end_date: string | null;
  agm_date: string | null;
  sensitivity_level: string | null;
  notes: string | null;
  person: {
    id: string;
    full_name: string;
    preferred_name: string | null;
    role_title: string | null;
  } | null;
};

type FileRecord = {
  id: string;
  file_name: string | null;
  source_url: string | null;
  public_url: string | null;
  file_description: string | null;
  document_type: string | null;
  evidence_category: string | null;
  version_label: string | null;
  sensitivity_level: string | null;
  created_at: string | null;
};

type RecordLink = {
  id: string;
  source_record_type: string;
  source_record_id: string;
  target_record_type: string;
  target_record_id: string;
  relationship_type: string | null;
  title: string | null;
  summary: string | null;
  created_at: string | null;
};

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
        darker ? "bg-[var(--surface)]" : "bg-[var(--surface-raised)]"
      }`}
    >
      <th className="w-56 px-4 py-4 align-top font-medium text-[var(--muted-foreground)]">
        {label}
      </th>
      <td className="px-4 py-4 text-[var(--foreground)]">{children}</td>
    </tr>
  );
}

function RoleStatusBadge({ status }: { status: string }) {
  const active = status === "active";
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        active
          ? "bg-emerald-950 text-emerald-400"
          : "bg-[var(--surface-raised)] text-[var(--muted-foreground)]"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")}
    </span>
  );
}

export default async function MaraeDetailPage({
  params,
}: MaraeDetailPageProps) {
  const { id } = await params;

  const [
    maraeResult,
    governanceResult,
    roleTermsResult,
    filesResult,
    sourceLinksResult,
    targetLinksResult,
  ] = await Promise.all([
    supabase.from("marae_records").select("*").eq("id", id).maybeSingle(),
    supabase
      .from("governance_records")
      .select("id, title, record_type, summary, status, effective_date, created_at")
      .eq("related_marae_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("governance_role_terms")
      .select(
        "id, role_title, role_type, status, appointment_method, term_start_date, term_end_date, agm_date, sensitivity_level, notes, person:person_id(id, full_name, preferred_name, role_title)"
      )
      .eq("marae_id", id)
      .order("term_start_date", { ascending: false }),
    supabase
      .from("record_files")
      .select(
        "id, file_name, source_url, public_url, file_description, document_type, evidence_category, version_label, sensitivity_level, created_at"
      )
      .eq("record_type", "marae_records")
      .eq("record_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_links")
      .select(
        "id, source_record_type, source_record_id, target_record_type, target_record_id, relationship_type, title, summary, created_at"
      )
      .eq("source_record_type", "marae_records")
      .eq("source_record_id", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("record_links")
      .select(
        "id, source_record_type, source_record_id, target_record_type, target_record_id, relationship_type, title, summary, created_at"
      )
      .eq("target_record_type", "marae_records")
      .eq("target_record_id", id)
      .order("created_at", { ascending: false }),
  ]);

  const marae = maraeResult.data as MaraeRecord | null;
  const linkedGovernanceRecords = (governanceResult.data ?? []) as GovernanceRecord[];
  const roleTerms = (roleTermsResult.data ?? []) as unknown as RoleTerm[];
  const fileRefs = (filesResult.data ?? []) as FileRecord[];
  const allLinks: RecordLink[] = [
    ...((sourceLinksResult.data ?? []) as RecordLink[]),
    ...((targetLinksResult.data ?? []) as RecordLink[]),
  ];

  const maraeName = marae?.name || marae?.title || "Untitled marae record";
  const activeRoles = roleTerms.filter((r) => r.status === "active");
  const previousRoles = roleTerms.filter((r) => r.status !== "active");

  return (
    <AppShell title="Marae Detail" eyebrow="Whenua & Marae">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Marae Record
        </p>

        {maraeResult.error ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-red-400">
              Database error
            </h1>
            <pre className="mt-4 whitespace-pre-wrap text-sm text-red-400">
              {maraeResult.error.message}
            </pre>
          </>
        ) : !marae ? (
          <>
            <h1 className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
              Marae record not found
            </h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              No marae record exists for this ID.
            </p>
            <Link
              href="/marae"
              className="mt-5 inline-block rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Back to Marae
            </Link>
          </>
        ) : (
          <>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {maraeName}
            </h1>
            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Marae record with governance roles, linked records, and file
              references.
            </p>
          </>
        )}
      </section>

      {marae && (
        <>
          {/* ── Marae Details ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Marae Details
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/marae"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Back to Marae
                </Link>
                <Link
                  href="/marae/new"
                  className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
                >
                  Add Marae
                </Link>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Name" darker>
                    <p className="font-medium text-[var(--foreground)]">
                      {maraeName}
                    </p>
                  </FieldRow>
                  <FieldRow label="Location">
                    {formatValue(marae.location)}
                  </FieldRow>
                  <FieldRow label="Description" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(marae.description)}
                    </p>
                  </FieldRow>
                  {marae.notes !== undefined && (
                    <FieldRow label="Notes">
                      <p className="whitespace-pre-wrap leading-6">
                        {formatValue(marae.notes)}
                      </p>
                    </FieldRow>
                  )}
                  {marae.status !== undefined && (
                    <FieldRow label="Status" darker>
                      {formatValue(marae.status)}
                    </FieldRow>
                  )}
                  <FieldRow label="Created">{formatDate(marae.created_at)}</FieldRow>
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Current Governance Roles ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Current Governance Roles
                </h2>
                {activeRoles.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {activeRoles.length} active{" "}
                    {activeRoles.length === 1 ? "role" : "roles"}
                  </p>
                )}
              </div>
              <Link
                href={`/marae/${id}/roles/new`}
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add Role / Trustee
              </Link>
            </div>

            {roleTermsResult.error ? (
              <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                <p className="font-semibold">Role terms query error</p>
                <pre className="mt-2 whitespace-pre-wrap">
                  {roleTermsResult.error.message}
                </pre>
              </div>
            ) : activeRoles.length === 0 ? (
              <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
                <h3 className="text-base font-semibold text-[var(--foreground)]">
                  No active governance roles recorded
                </h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Add the current trustees, chair, secretary, and other
                  governance roles for this marae.
                </p>
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Person</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Appointment</th>
                      <th className="px-4 py-3 font-medium">Term Start</th>
                      <th className="px-4 py-3 font-medium">Term End</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeRoles.map((term) => (
                      <tr
                        key={term.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                      >
                        <td className="px-4 py-4">
                          {term.person ? (
                            <Link
                              href={`/people/${term.person.id}`}
                              className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              {formatPersonName(term.person)}
                            </Link>
                          ) : (
                            <span className="text-[var(--muted-foreground)]">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {term.role_title}
                          {term.role_type && (
                            <p className="mt-0.5 text-xs">
                              {term.role_type}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(term.appointment_method)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatDate(term.term_start_date)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatDate(term.term_end_date)}
                        </td>
                        <td className="px-4 py-4">
                          <RoleStatusBadge status={term.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Previous roles */}
            {previousRoles.length > 0 && (
              <>
                <h3 className="mt-8 text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Previous Roles
                </h3>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-[var(--border)]">
                  <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                    <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Person</th>
                        <th className="px-4 py-3 font-medium">Role</th>
                        <th className="px-4 py-3 font-medium">Term Start</th>
                        <th className="px-4 py-3 font-medium">Term End</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousRoles.map((term) => (
                        <tr
                          key={term.id}
                          className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                        >
                          <td className="px-4 py-4">
                            {term.person ? (
                              <Link
                                href={`/people/${term.person.id}`}
                                className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                              >
                                {formatPersonName(term.person)}
                              </Link>
                            ) : (
                              <span className="text-[var(--muted-foreground)]">—</span>
                            )}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {term.role_title}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatDate(term.term_start_date)}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatDate(term.term_end_date)}
                          </td>
                          <td className="px-4 py-4">
                            <RoleStatusBadge status={term.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </section>

          {/* ── Linked Governance Records ── */}
          {(governanceResult.error || linkedGovernanceRecords.length > 0) && (
            <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--foreground)]">
                    Linked Governance Records
                  </h2>
                  {linkedGovernanceRecords.length > 0 && (
                    <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                      {linkedGovernanceRecords.length}{" "}
                      {linkedGovernanceRecords.length === 1 ? "record" : "records"}
                    </p>
                  )}
                </div>
                <Link
                  href="/governance/new"
                  className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                >
                  Add Governance Record
                </Link>
              </div>

              {governanceResult.error ? (
                <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                  <p className="font-semibold">Governance query error</p>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {governanceResult.error.message}
                  </pre>
                </div>
              ) : (
                <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                  <table className="w-full min-w-[720px] border-collapse text-left text-sm">
                    <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                      <tr>
                        <th className="px-4 py-3 font-medium">Title</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Effective Date</th>
                        <th className="px-4 py-3 font-medium">Open</th>
                      </tr>
                    </thead>
                    <tbody>
                      {linkedGovernanceRecords.map((rec) => (
                        <tr
                          key={rec.id}
                          className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                        >
                          <td className="px-4 py-4">
                            <Link
                              href={`/governance/${rec.id}`}
                              className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              {rec.title || "Untitled governance record"}
                            </Link>
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatValue(rec.record_type)}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatValue(rec.status)}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatDate(rec.effective_date)}
                          </td>
                          <td className="px-4 py-4">
                            <Link
                              href={`/governance/${rec.id}`}
                              className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {/* ── File References ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  File References
                </h2>
                {fileRefs.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {fileRefs.length}{" "}
                    {fileRefs.length === 1 ? "file" : "files"}
                  </p>
                )}
              </div>
              <Link
                href={`/records/marae_records/${id}/files/new`}
                className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
              >
                Add File Reference
              </Link>
            </div>

            {filesResult.error ? (
              <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
                <p className="font-semibold">Files query error</p>
                <pre className="mt-2 whitespace-pre-wrap">
                  {filesResult.error.message}
                </pre>
              </div>
            ) : fileRefs.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No file references yet. Add condition reports, photos,
                restoration plans, funding applications, or trust deed
                documents.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">File</th>
                      <th className="px-4 py-3 font-medium">Type</th>
                      <th className="px-4 py-3 font-medium">Category</th>
                      <th className="px-4 py-3 font-medium">Sensitivity</th>
                      <th className="px-4 py-3 font-medium">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fileRefs.map((f) => (
                      <tr
                        key={f.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                      >
                        <td className="px-4 py-4">
                          <p className="font-medium text-[var(--foreground)]">
                            {f.file_name || "Unnamed file"}
                          </p>
                          {f.file_description && (
                            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                              {f.file_description}
                            </p>
                          )}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(f.document_type)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(f.evidence_category)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(f.sensitivity_level)}
                        </td>
                        <td className="px-4 py-4">
                          {f.source_url || f.public_url ? (
                            <a
                              href={f.source_url ?? f.public_url ?? ""}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--accent)] hover:underline"
                            >
                              Open
                            </a>
                          ) : (
                            <span className="text-[var(--muted-foreground)]">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ── Linked Records ── */}
          <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  Linked Records
                </h2>
                {allLinks.length > 0 && (
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {allLinks.length} linked{" "}
                    {allLinks.length === 1 ? "record" : "records"}
                  </p>
                )}
              </div>
            </div>

            {allLinks.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No cross-record links yet. Links to whenua, hui, projects, and
                service providers will appear here.
              </p>
            ) : (
              <div className="mt-6 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Record Type</th>
                      <th className="px-4 py-3 font-medium">Relationship</th>
                      <th className="px-4 py-3 font-medium">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allLinks.map((link) => {
                      const isSource =
                        link.source_record_type === "marae_records" &&
                        link.source_record_id === id;
                      const linkedType = isSource
                        ? link.target_record_type
                        : link.source_record_type;
                      return (
                        <tr
                          key={link.id}
                          className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                        >
                          <td className="px-4 py-4 font-medium text-[var(--foreground)]">
                            {link.title || `${linkedType} record`}
                            {link.summary && (
                              <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                                {link.summary}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {linkedType}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatValue(link.relationship_type)}
                          </td>
                          <td className="px-4 py-4 text-[var(--muted-foreground)]">
                            {formatDate(link.created_at)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </AppShell>
  );
}
