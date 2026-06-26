import Link from "next/link";
import AppShell from "@/components/layout/AppShell";

type ReportCard = {
  title: string;
  href: string;
  description: string;
  proves: string;
  tables: string[];
};

const reportCards: ReportCard[] = [
  {
    title: "Governance Chain Report",
    href: "/reports/governance-chain",
    description:
      "Full chain from hui through minutes, decisions, tasks, and evidence — showing how governance decisions are made, recorded, and actioned.",
    proves: "Proves governance process, accountability chain, and decision traceability.",
    tables: ["hui", "minutes", "decisions", "tasks", "record_files"],
  },
  {
    title: "Hui Participation Report",
    href: "/reports/hui-participation",
    description:
      "Attendance and participation evidence across all hui — showing who attended, apologies, roles, and engagement depth.",
    proves: "Proves community participation and governance engagement for funders and regulators.",
    tables: ["hui", "hui_attendees", "people"],
  },
  {
    title: "Decisions and Actions Report",
    href: "/decisions",
    description:
      "Full register of formal decisions — status, source minutes, linked hui, resulting tasks, and document references.",
    proves: "Proves formal decision-making and follow-through accountability.",
    tables: ["decisions", "minutes", "tasks"],
  },
  {
    title: "Marae Governance Report",
    href: "/reports/marae-governance",
    description:
      "Trustee and governance role structure, term history, appointment evidence, and AGM records for all marae.",
    proves: "Proves governance structure, trustee continuity, and appointment legitimacy.",
    tables: ["marae_records", "governance_role_terms", "people"],
  },
  {
    title: "Evidence and Files Report",
    href: "/reports/evidence-files",
    description:
      "Complete audit of file and evidence references — by type, category, sensitivity, verification status, and upcoming reviews.",
    proves: "Proves document register completeness and evidence readiness.",
    tables: ["record_files"],
  },
  {
    title: "Funding Readiness Snapshot",
    href: "/reports/funding-readiness",
    description:
      "Data completeness indicators across all governance, land, people, and evidence modules — showing readiness for funding applications.",
    proves: "Shows whether the organisation has the evidence base needed for funding applications.",
    tables: ["all modules"],
  },
  {
    title: "Document Register",
    href: "/reports/document-register",
    description:
      "Printable register of all documents and file references — status, type, sensitivity, review dates, and expiry dates.",
    proves: "Standard document register for auditors, funders, and governance review.",
    tables: ["documents", "record_files"],
  },
];

export default function ReportsPage() {
  return (
    <AppShell title="Reports" eyebrow="Intelligence">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Reporting Centre
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Reports
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Live reports generated from your governance records. Each report turns
          raw data into structured evidence — governance chains, participation
          records, trustee history, and funding-readiness summaries. Reports
          reflect current database state and can be printed or saved as PDF
          using your browser.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/library"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Library
          </Link>
          <Link
            href="/library/evidence"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Evidence Archive
          </Link>
        </div>
      </section>

      {/* ── Report Cards ── */}
      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Available Reports
        </h2>
        <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reportCards.map((card) => (
            <Link
              key={card.href + card.title}
              href={card.href}
              className="group flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-6 transition hover:border-[var(--accent)]"
            >
              <div>
                <h3 className="font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {card.description}
                </p>
                <p className="mt-3 text-xs font-medium text-[var(--foreground)]">
                  {card.proves}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {card.tables.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted-foreground)]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Note on v1 ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium text-[var(--foreground)]">
          About Reporting v1
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          Reports in v1 reflect live database records as honest summaries — no
          fabricated data, no placeholder counts. Where records are missing,
          empty states are shown. All reports can be printed via the browser
          print function (Ctrl+P / Cmd+P) or using the "Print / Save as PDF"
          button on each report page. PDF generation, CSV export, and scheduled
          report delivery are planned for future versions.
        </p>
      </section>
    </AppShell>
  );
}
