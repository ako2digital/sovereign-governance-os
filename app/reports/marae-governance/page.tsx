import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ReportStatCard from "@/components/reports/ReportStatCard";
import PrintButton from "@/components/reports/PrintButton";
import { supabase } from "@/lib/supabaseClient";
import { formatDate, formatValue, formatPersonName } from "@/lib/utils";

type MaraeRow = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  status?: string | null;
};

type RoleTermRow = {
  id: string;
  marae_id?: string | null;
  role_title: string;
  role_type?: string | null;
  status: string;
  appointment_method?: string | null;
  term_start_date?: string | null;
  term_end_date?: string | null;
  agm_date?: string | null;
  verification_status?: string | null;
  notes?: string | null;
  related_hui_id?: string | null;
  related_minutes_id?: string | null;
  related_decision_id?: string | null;
  related_document_id?: string | null;
  person: {
    id: string;
    full_name: string;
    preferred_name?: string | null;
    role_title?: string | null;
  } | null;
};

export default async function MaraeGovernanceReportPage() {
  const [maraeResult, roleTermsResult] = await Promise.all([
    supabase
      .from("marae_records")
      .select("id, name, title, location, status")
      .order("created_at", { ascending: false }),
    supabase
      .from("governance_role_terms")
      .select(
        "id, marae_id, role_title, role_type, status, appointment_method, term_start_date, term_end_date, agm_date, verification_status, notes, related_hui_id, related_minutes_id, related_decision_id, related_document_id, person:person_id(id, full_name, preferred_name, role_title)"
      )
      .order("term_start_date", { ascending: false }),
  ]);

  const maraeRecords = (maraeResult.data ?? []) as MaraeRow[];
  const roleTerms = (roleTermsResult.data ?? []) as unknown as RoleTermRow[];

  const activeTerms = roleTerms.filter((r) => r.status === "active");
  const previousTerms = roleTerms.filter((r) => r.status !== "active");
  const verifiedTerms = roleTerms.filter(
    (r) => r.verification_status && r.verification_status !== "unverified"
  );
  const withAgm = roleTerms.filter((r) => r.agm_date);

  const generatedAt = new Date().toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const termsByMarae: Record<string, RoleTermRow[]> = {};
  for (const term of roleTerms) {
    const key = term.marae_id ?? "no_marae";
    if (!termsByMarae[key]) termsByMarae[key] = [];
    termsByMarae[key].push(term);
  }

  return (
    <AppShell title="Marae Governance" eyebrow="Intelligence">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8 print:border-none print:p-0">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Governance Report
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              Marae Governance Report
            </h1>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Generated {generatedAt}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/reports"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)] print:hidden"
            >
              All Reports
            </Link>
            <PrintButton />
          </div>
        </div>
        <p className="mt-4 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Trustee and governance role structure, appointment history, term dates,
          AGM records, and verification status for all marae. This report supports
          governance continuity, AGM preparation, funder confidence, and trustee
          history requirements.
        </p>
      </section>

      {/* ── Stats ── */}
      <section className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <ReportStatCard label="Marae Records" value={maraeRecords.length} />
        <ReportStatCard label="Active Role Terms" value={activeTerms.length} subtext="current trustees &amp; roles" />
        <ReportStatCard label="Previous Terms" value={previousTerms.length} subtext="historical record" />
        <ReportStatCard label="Verified Terms" value={verifiedTerms.length} subtext="document or minutes verified" />
      </section>

      {/* ── Errors ── */}
      {maraeResult.error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          <p className="font-semibold">Marae query error: {maraeResult.error.message}</p>
        </div>
      )}
      {roleTermsResult.error && (
        <div className="mt-6 rounded-xl border border-red-900 bg-red-950/30 p-4 text-sm text-red-400">
          <p className="font-semibold">Role terms query error: {roleTermsResult.error.message}</p>
        </div>
      )}

      {/* ── By Marae ── */}
      {maraeRecords.map((marae) => {
        const terms = termsByMarae[marae.id] ?? [];
        const maraeName = marae.name || marae.title || "Untitled marae record";
        const active = terms.filter((t) => t.status === "active");
        const previous = terms.filter((t) => t.status !== "active");

        return (
          <section
            key={marae.id}
            className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  <Link
                    href={`/marae/${marae.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {maraeName}
                  </Link>
                </h2>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {marae.location ? `${marae.location} · ` : ""}
                  {marae.status ?? ""}
                </p>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-emerald-950 px-2.5 py-1 text-emerald-400">
                  {active.length} active
                </span>
                {previous.length > 0 && (
                  <span className="rounded-full border border-[var(--border)] px-2.5 py-1 text-[var(--muted-foreground)]">
                    {previous.length} previous
                  </span>
                )}
              </div>
            </div>

            {terms.length === 0 ? (
              <p className="mt-4 text-sm text-[var(--muted-foreground)]">
                No governance role terms recorded for this marae.{" "}
                <Link
                  href={`/marae/${marae.id}/roles/new`}
                  className="underline-offset-4 hover:underline"
                >
                  Add a role term.
                </Link>
              </p>
            ) : (
              <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
                <table className="w-full min-w-[800px] border-collapse text-left text-sm">
                  <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Person</th>
                      <th className="px-4 py-3 font-medium">Role</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Appointment</th>
                      <th className="px-4 py-3 font-medium">Term Start</th>
                      <th className="px-4 py-3 font-medium">Term End</th>
                      <th className="px-4 py-3 font-medium">AGM Date</th>
                      <th className="px-4 py-3 font-medium">Verification</th>
                      <th className="px-4 py-3 font-medium">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {terms.map((term) => (
                      <tr
                        key={term.id}
                        className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]"
                      >
                        <td className="px-4 py-4">
                          {term.person ? (
                            <Link
                              href={`/people/${term.person.id}`}
                              className="font-medium text-[var(--foreground)] underline-offset-4 hover:underline"
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
                            <p className="mt-0.5 text-xs">{term.role_type}</p>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              term.status === "active"
                                ? "bg-emerald-950 text-emerald-400"
                                : "border border-[var(--border)] text-[var(--muted-foreground)]"
                            }`}
                          >
                            {term.status}
                          </span>
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
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatDate(term.agm_date)}
                        </td>
                        <td className="px-4 py-4 text-[var(--muted-foreground)]">
                          {formatValue(term.verification_status)}
                        </td>
                        <td className="px-4 py-4 text-xs text-[var(--muted-foreground)]">
                          {term.related_hui_id && (
                            <Link href={`/hui/${term.related_hui_id}`} className="block underline-offset-4 hover:underline">
                              Hui
                            </Link>
                          )}
                          {term.related_minutes_id && (
                            <Link href={`/minutes/${term.related_minutes_id}`} className="block underline-offset-4 hover:underline">
                              Minutes
                            </Link>
                          )}
                          {term.related_decision_id && (
                            <Link href={`/decisions/${term.related_decision_id}`} className="block underline-offset-4 hover:underline">
                              Decision
                            </Link>
                          )}
                          {!term.related_hui_id && !term.related_minutes_id && !term.related_decision_id && "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        );
      })}

      {maraeRecords.length === 0 && !maraeResult.error && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            No marae records yet
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Add marae records and governance role terms to generate this report.
          </p>
          <Link
            href="/marae/new"
            className="mt-4 inline-block rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Add Marae Record
          </Link>
        </section>
      )}

      {/* AGM summary if any */}
      {withAgm.length > 0 && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            AGM Records
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Role terms with an AGM date recorded.
          </p>
          <div className="mt-5 overflow-x-auto rounded-2xl border border-[var(--border)]">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="border-b border-[var(--border)] bg-[var(--surface-raised)] text-[var(--muted-foreground)]">
                <tr>
                  <th className="px-4 py-3 font-medium">Person</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">AGM Date</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {withAgm.map((term) => (
                  <tr key={term.id} className="border-t border-[var(--border)] transition hover:bg-[var(--surface-raised)]">
                    <td className="px-4 py-4 font-medium text-[var(--foreground)]">
                      {term.person ? formatPersonName(term.person) : "—"}
                    </td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{term.role_title}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatDate(term.agm_date)}</td>
                    <td className="px-4 py-4 text-[var(--muted-foreground)]">{formatValue(term.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </AppShell>
  );
}
