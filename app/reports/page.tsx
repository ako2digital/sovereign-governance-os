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
      "Full chain from hui through minutes, decisions, tasks, and evidence. Shows how positions were formed, who participated, and what mandate exists. Use this to prove process to funders, councils, or partners.",
    proves: "Proves governance process, mandate chain, participation, and decision traceability.",
    tables: ["hui", "minutes", "decisions", "tasks", "record_files"],
  },
  {
    title: "Hui Participation Report",
    href: "/reports/hui-participation",
    description:
      "Attendance and participation evidence across all hui — who attended, apologies, roles, and engagement. Shows that positions came from a real process, not just two people claiming to speak for a hapū.",
    proves: "Proves community participation and mandate for governance positions.",
    tables: ["hui", "hui_attendees", "people"],
  },
  {
    title: "Decisions and Actions Report",
    href: "/decisions",
    description:
      "Full register of formal decisions — status, source minutes, linked hui, resulting tasks, and document references. Each decision links back to the process that created it.",
    proves: "Proves formal decision-making, follow-through accountability, and action delivery.",
    tables: ["decisions", "minutes", "tasks"],
  },
  {
    title: "Marae Governance Report",
    href: "/reports/marae-governance",
    description:
      "Trustee and governance role structure, term history, appointment evidence, and AGM records. Proves that governance is properly constituted and trustees are legitimately appointed.",
    proves: "Proves governance structure, trustee legitimacy, and appointment continuity.",
    tables: ["marae_records", "governance_role_terms", "people"],
  },
  {
    title: "Evidence and Files Report",
    href: "/reports/evidence-files",
    description:
      "Complete audit of file and evidence references — by type, category, sensitivity, verification status, and upcoming reviews. Shows what evidence exists and what gaps remain.",
    proves: "Proves document register completeness and evidence readiness for funding or audit.",
    tables: ["record_files"],
  },
  {
    title: "Funding Readiness Snapshot",
    href: "/reports/funding-readiness",
    description:
      "Data completeness indicators across all governance, land, people, and evidence modules. Shows what is in place and what is missing before a funding application or negotiation.",
    proves: "Shows the evidence base available for funding applications, council engagement, and partner negotiations.",
    tables: ["all modules"],
  },
  {
    title: "Document Register",
    href: "/reports/document-register",
    description:
      "Printable register of all documents and file references — status, type, sensitivity, review dates, and expiry. Standard format for auditors, funders, and governance review.",
    proves: "Standard document register for audit trail, funder compliance, and governance record-keeping.",
    tables: ["documents", "record_files"],
  },
];

export default function ReportsPage() {
  return (
    <AppShell title="Reports" eyebrow="Intelligence & Outcomes">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Intelligence & Outcomes
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Reports
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
          Turn organisation-held records into insight, mandate, and evidence.
          Reports prove what happened, who was involved, what was decided, what evidence supports it,
          and what mandate exists. Use reports to negotiate from your own data — in council engagement,
          funding applications, iwi agreements, trustee reporting, and partner negotiations.
          Reports are also how you report back to the people the data belongs to.
        </p>
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            What these reports show
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Reports reflect current database state — real records, real counts, no fabricated data.
            Where records are missing, gaps are shown. The goal is to show not just that you have data,
            but that the data proves a process, demonstrates mandate, and supports outcomes.
            Can be printed via browser (Ctrl+P / Cmd+P) or saved as PDF.
          </p>
        </div>
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

      {/* ── Mandate + Outcomes note ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-sm font-medium text-[var(--foreground)]">
          Negotiate from evidence. Report back to the people.
        </h2>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
          The most useful thing Tangata does is help you walk into a meeting with your own evidence —
          structured data, participation records, minutes, decisions, supporting documents, and a clear
          chain showing how a position was formed and who authorised it.
          This is what it means to negotiate from evidence, not from claims.
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Reports are also the foundation for controlled, purpose-based sharing —
          where your organisation decides what is shared with councils, funders, iwi bodies,
          service providers, or statutory agencies, and on what terms.
          What is shared, who it is shared with, why, and what outcome is expected
          should always be recorded and reported back to the people the data belongs to.
        </p>
        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          A dedicated Outcomes register and controlled-sharing layer are planned for future passes.
          For now, the Governance Chain report provides the closest available view of what was decided,
          what was actioned, and what evidence supports it.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/reports/governance-chain"
            className="text-xs font-medium text-[var(--accent)] transition hover:opacity-75"
          >
            View Governance Chain report →
          </Link>
          <Link
            href="/organisation"
            className="text-xs font-medium text-[var(--accent)] transition hover:opacity-75"
          >
            Organisation Profile →
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
