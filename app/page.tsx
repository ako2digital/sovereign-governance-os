import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type ModuleStatus = {
  label: string;
  description: string;
  href: string;
  tableName: string;
};

type RecentActivity = {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  description: string | null;
  created_at: string;
};

const modules: ModuleStatus[] = [
  {
    label: "People Registry",
    description: "Individual people records and profile registry.",
    href: "/people",
    tableName: "people",
  },
  {
    label: "Whakapapa Relationships",
    description: "Relationship records connecting people together.",
    href: "/whakapapa",
    tableName: "whakapapa_relationships",
  },
  {
    label: "Whenua Records",
    description: "Land blocks, legal references, and whenua notes.",
    href: "/whenua",
    tableName: "whenua_records",
  },
  {
    label: "Marae Records",
    description: "Marae records, locations, and infrastructure references.",
    href: "/marae",
    tableName: "marae_records",
  },
  {
    label: "Governance Records",
    description: "Mandates, agreements, kaupapa, and governance items.",
    href: "/governance",
    tableName: "governance_records",
  },
  {
    label: "Hui Records",
    description: "Meetings, kaupapa, agendas, and connected records.",
    href: "/hui",
    tableName: "hui",
  },
  {
    label: "Minutes",
    description: "Hui minutes, summaries, and approval tracking.",
    href: "/minutes",
    tableName: "minutes",
  },
  {
    label: "Decisions",
    description: "Formal decisions connected to hui and minutes.",
    href: "/decisions",
    tableName: "decisions",
  },
  {
    label: "Documents",
    description: "Document register and related record references.",
    href: "/documents",
    tableName: "documents",
  },
  {
    label: "Pānui",
    description: "Announcements, notices, and communication records.",
    href: "/panui",
    tableName: "panui",
  },
  {
    label: "Tasks",
    description: "Operational tasks, priorities, assignments, and due dates.",
    href: "/tasks",
    tableName: "tasks",
  },
  {
    label: "Activity Log",
    description: "System activity trail and record history.",
    href: "/activity",
    tableName: "activity_log",
  },
];

async function getTableCount(tableName: string) {
  const { count, error } = await supabase
    .from(tableName)
    .select("*", { count: "exact", head: true });

  if (error) {
    return {
      count: 0,
      error: error.message,
    };
  }

  return {
    count: count ?? 0,
    error: null,
  };
}

export default async function DashboardPage() {
  const moduleCounts = await Promise.all(
    modules.map(async (module) => {
      const result = await getTableCount(module.tableName);

      return {
        ...module,
        count: result.count,
        error: result.error,
      };
    })
  );

  const totalRecords = moduleCounts.reduce(
    (total, module) => total + module.count,
    0
  );

  const activeModules = moduleCounts.filter((module) => !module.error).length;

  const { data: activityData, error: activityError } = await supabase
    .from("activity_log")
    .select(
      `
      id,
      action,
      entity_type,
      entity_id,
      description,
      created_at
    `
    )
    .order("created_at", { ascending: false })
    .limit(5);

  const recentActivity = (activityData ?? []) as RecentActivity[];

  return (
    <AppShell title="Dashboard" eyebrow="Sovereign Governance OS">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          MVP Command Centre
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Hapū Relational Infrastructure Platform
        </h1>

        <p className="mt-4 max-w-3xl text-stone-400">
          Live operational dashboard for the MVP system. This view shows the
          current module status, record counts, and recent activity across the
          core hapū data infrastructure.
        </p>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Total Records
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {totalRecords}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Across all core MVP tables.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Active Modules
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">
            {activeModules}/{modules.length}
          </p>
          <p className="mt-2 text-sm text-stone-400">
            Modules currently reading from Supabase.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            MVP Status
          </p>
          <p className="mt-3 text-3xl font-semibold text-white">Active</p>
          <p className="mt-2 text-sm text-stone-400">
            Register, create, detail, and relational navigation layers are live.
          </p>
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              MVP System Status
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Board-ready view of each live module, record count, and direct
              access point.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {modules.length} modules
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {moduleCounts.map((module) => (
            <a
              key={module.tableName}
              href={module.href}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-5 transition hover:border-stone-600 hover:bg-stone-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-white">
                    {module.label}
                  </h3>
                  <p className="mt-2 text-sm text-stone-400">
                    {module.description}
                  </p>
                </div>

                <span className="rounded-full border border-emerald-900 bg-emerald-950/40 px-3 py-1 text-xs font-medium text-emerald-300">
                  {module.error ? "Check" : "Active"}
                </span>
              </div>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                    Records
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {module.count}
                  </p>
                </div>

                <p className="text-sm font-medium text-stone-300">
                  Open module →
                </p>
              </div>

              {module.error ? (
                <div className="mt-4 rounded-xl border border-red-900 bg-red-950/40 p-3 text-xs text-red-300">
                  {module.error}
                </div>
              ) : null}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Recent Activity
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Latest records from the activity_log table.
            </p>
          </div>

          <a
            href="/activity"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-200 transition hover:border-stone-500 hover:text-white"
          >
            View Activity
          </a>
        </div>

        {activityError ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {activityError.message}
            </pre>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No activity yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Activity records will appear here once system logging is added.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-white">{activity.action}</p>
                  <p className="text-xs text-stone-500">
                    {activity.created_at}
                  </p>
                </div>

                <p className="mt-2 text-sm text-stone-400">
                  {activity.description || "—"}
                </p>

                <p className="mt-3 text-xs text-stone-500">
                  {activity.entity_type || "unknown"}{" "}
                  {activity.entity_id ? `• ${activity.entity_id}` : ""}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}