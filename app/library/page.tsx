import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ReportStatCard from "@/components/reports/ReportStatCard";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/lib/utils";

type RecentDoc = {
  id: string;
  title?: string | null;
  name?: string | null;
  document_type?: string | null;
  status?: string | null;
  created_at?: string | null;
};

type RecentFile = {
  id: string;
  file_name?: string | null;
  document_type?: string | null;
  record_type?: string | null;
  created_at?: string | null;
};

export default async function LibraryPage() {
  const [
    huiCount,
    minutesCount,
    decisionsCount,
    tasksCount,
    documentsCount,
    governanceCount,
    filesCount,
    panui,
    maraeCount,
    whenua,
    people,
    recentDocsResult,
    recentFilesResult,
  ] = await Promise.all([
    supabase.from("hui").select("*", { count: "exact", head: true }),
    supabase.from("minutes").select("*", { count: "exact", head: true }),
    supabase.from("decisions").select("*", { count: "exact", head: true }),
    supabase.from("tasks").select("*", { count: "exact", head: true }),
    supabase.from("documents").select("*", { count: "exact", head: true }),
    supabase.from("governance_records").select("*", { count: "exact", head: true }),
    supabase.from("record_files").select("*", { count: "exact", head: true }),
    supabase.from("panui").select("*", { count: "exact", head: true }),
    supabase.from("marae_records").select("*", { count: "exact", head: true }),
    supabase.from("whenua").select("*", { count: "exact", head: true }),
    supabase.from("people").select("*", { count: "exact", head: true }),
    supabase
      .from("documents")
      .select("id, title, name, document_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("record_files")
      .select("id, file_name, document_type, record_type, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentDocs = (recentDocsResult.data ?? []) as RecentDoc[];
  const recentFiles = (recentFilesResult.data ?? []) as RecentFile[];

  const modules = [
    { label: "Documents", href: "/documents", count: documentsCount.count ?? 0, desc: "Official documents and register" },
    { label: "File References", href: "/library/files", count: filesCount.count ?? 0, desc: "Evidence and file references" },
    { label: "Minutes", href: "/minutes", count: minutesCount.count ?? 0, desc: "Meeting minutes and approvals" },
    { label: "Hui", href: "/hui", count: huiCount.count ?? 0, desc: "Hui records and attendance" },
    { label: "Decisions", href: "/decisions", count: decisionsCount.count ?? 0, desc: "Formal decisions register" },
    { label: "Governance Records", href: "/governance", count: governanceCount.count ?? 0, desc: "Governance mandates and authority" },
    { label: "Marae Records", href: "/marae", count: maraeCount.count ?? 0, desc: "Marae profile and role terms" },
    { label: "Whenua", href: "/whenua", count: whenua.count ?? 0, desc: "Land and property records" },
    { label: "Pānui", href: "/panui", count: panui.count ?? 0, desc: "Notices and announcements" },
    { label: "People", href: "/people", count: people.count ?? 0, desc: "People register" },
    { label: "Tasks", href: "/tasks", count: tasksCount.count ?? 0, desc: "Open and completed tasks" },
  ];

  const totalRecords =
    (huiCount.count ?? 0) +
    (minutesCount.count ?? 0) +
    (decisionsCount.count ?? 0) +
    (tasksCount.count ?? 0) +
    (documentsCount.count ?? 0) +
    (governanceCount.count ?? 0) +
    (filesCount.count ?? 0) +
    (panui.count ?? 0) +
    (maraeCount.count ?? 0) +
    (whenua.count ?? 0) +
    (people.count ?? 0);

  return (
    <AppShell title="Library" eyebrow="Library & Evidence">
      {/* ── Header ── */}
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Library & Evidence
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Library
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-[var(--muted-foreground)]">
          The central archive and evidence layer — documents, file references, and records
          that prove the governance chain. Use the Library to navigate the archive,
          build funding-ready evidence packs, prepare negotiation materials, and retrieve
          records for audit or reporting. Evidence here supports every claim made in reports.
        </p>
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            What belongs here
          </p>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Documents, file references, signed minutes, evidence references, legal documents,
            funding documents, reports, maps, photos, and archival material. The Library
            supports proof, retrieval, reporting, funding readiness, negotiation packs,
            governance packs, and audit trails.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/library/files"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            File Index
          </Link>
          <Link
            href="/library/evidence"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Evidence Archive
          </Link>
          <Link
            href="/reports"
            className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
          >
            Go to Reports
          </Link>
        </div>
      </section>

      {/* ── Summary Stats ── */}
      <section className="mt-8">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Archive Summary
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <ReportStatCard label="Total Records" value={totalRecords} subtext="across all modules" />
          <ReportStatCard label="Documents" value={documentsCount.count ?? 0} />
          <ReportStatCard label="File References" value={filesCount.count ?? 0} subtext="evidence &amp; file refs" />
          <ReportStatCard label="Minutes" value={minutesCount.count ?? 0} />
          <ReportStatCard label="Decisions" value={decisionsCount.count ?? 0} />
          <ReportStatCard label="Hui" value={huiCount.count ?? 0} />
          <ReportStatCard label="Governance Records" value={governanceCount.count ?? 0} />
          <ReportStatCard label="Marae Records" value={maraeCount.count ?? 0} />
        </div>
      </section>

      {/* ── Module Index ── */}
      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Archive Modules
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          All record modules in the system. Click to open the module register.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="group flex items-start justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)]"
            >
              <div>
                <p className="font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
                  {mod.label}
                </p>
                <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                  {mod.desc}
                </p>
              </div>
              <span className="ml-4 shrink-0 rounded-full border border-[var(--border)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--muted-foreground)]">
                {mod.count}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Library Sub-sections ── */}
      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Library Views
        </h2>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          Filtered views of the archive for evidence, files, and reporting.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Link
            href="/library/files"
            className="group rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition hover:border-[var(--accent)]"
          >
            <p className="font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
              File &amp; Evidence Index
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              All file references, evidence URLs, and document links registered
              against any record type. {filesCount.count ?? 0} references.
            </p>
          </Link>
          <Link
            href="/library/evidence"
            className="group rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-5 transition hover:border-[var(--accent)]"
          >
            <p className="font-semibold text-[var(--foreground)] transition group-hover:text-[var(--accent)]">
              Evidence Archive
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Evidence references grouped by category — funding, governance,
              compliance, land, and operational evidence.
            </p>
          </Link>
        </div>
      </section>

      {/* ── Recently Added ── */}
      {(recentDocs.length > 0 || recentFiles.length > 0) && (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Recently Added
          </h2>

          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            {recentDocs.length > 0 && (
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Recent Documents
                </h3>
                <div className="mt-3 space-y-2">
                  {recentDocs.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/documents/${doc.id}`}
                      className="flex items-start justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 transition hover:border-[var(--accent)]"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {doc.title || doc.name || "Untitled document"}
                        </p>
                        {doc.document_type && (
                          <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                            {doc.document_type}
                          </p>
                        )}
                      </div>
                      <p className="ml-4 shrink-0 text-xs text-[var(--muted-foreground)]">
                        {formatDate(doc.created_at)}
                      </p>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/documents"
                  className="mt-3 block text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline"
                >
                  View all documents →
                </Link>
              </div>
            )}

            {recentFiles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                  Recent File References
                </h3>
                <div className="mt-3 space-y-2">
                  {recentFiles.map((f) => (
                    <div
                      key={f.id}
                      className="flex items-start justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          {f.file_name || "Unnamed file"}
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
                          {f.document_type ? `${f.document_type} · ` : ""}
                          {f.record_type ?? ""}
                        </p>
                      </div>
                      <p className="ml-4 shrink-0 text-xs text-[var(--muted-foreground)]">
                        {formatDate(f.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/library/files"
                  className="mt-3 block text-xs font-medium text-[var(--muted-foreground)] underline-offset-4 hover:underline"
                >
                  View all file references →
                </Link>
              </div>
            )}
          </div>
        </section>
      )}
    </AppShell>
  );
}
