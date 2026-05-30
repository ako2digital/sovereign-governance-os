import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type ModuleCount = {
  label: string;
  href: string;
  count: number;
};

type RecentActivityRecord = {
  id: string;
  action: string;
  entity_type: string | null;
  description: string | null;
  created_at: string;
};

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
  const [
    peopleCount,
    whakapapaCount,
    whenuaCount,
    maraeCount,
    governanceCount,
    huiCount,
    minutesCount,
    decisionsCount,
    documentsCount,
    panuiCount,
    tasksCount,
    activityCount,
    recentActivityResult,
  ] = await Promise.all([
    getTableCount("people"),
    getTableCount("whakapapa_relationships"),
    getTableCount("whenua_records"),
    getTableCount("marae_records"),
    getTableCount("governance_records"),
    getTableCount("hui"),
    getTableCount("minutes"),
    getTableCount("decisions"),
    getTableCount("documents"),
    getTableCount("panui"),
    getTableCount("tasks"),
    getTableCount("activity_log"),
    supabase
      .from("activity_log")
      .select(
        `
        id,
        action,
        entity_type,
        description,
        created_at
      `
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const moduleCounts: ModuleCount[] = [
    {
      label: "People",
      href: "/people",
      count: peopleCount.count,
    },
    {
      label: "Whakapapa",
      href: "/whakapapa",
      count: whakapapaCount.count,
    },
    {
      label: "Whenua",
      href: "/whenua",
      count: whenuaCount.count,
    },
    {
      label: "Marae",
      href: "/marae",
      count: maraeCount.count,
    },
    {
      label: "Governance",
      href: "/governance",
      count: governanceCount.count,
    },
    {
      label: "Hui",
      href: "/hui",
      count: huiCount.count,
    },
    {
      label: "Minutes",
      href: "/minutes",
      count: minutesCount.count,
    },
    {
      label: "Decisions",
      href: "/decisions",
      count: decisionsCount.count,
    },
    {
      label: "Documents",
      href: "/documents",
      count: documentsCount.count,
    },
    {
      label: "Pānui",
      href: "/panui",
      count: panuiCount.count,
    },
    {
      label: "Tasks",
      href: "/tasks",
      count: tasksCount.count,
    },
    {
      label: "Activity",
      href: "/activity",
      count: activityCount.count,
    },
  ];

  const countErrors = [
    peopleCount.error,
    whakapapaCount.error,
    whenuaCount.error,
    maraeCount.error,
    governanceCount.error,
    huiCount.error,
    minutesCount.error,
    decisionsCount.error,
    documentsCount.error,
    panuiCount.error,
    tasksCount.error,
    activityCount.error,
    recentActivityResult.error?.message ?? null,
  ].filter(Boolean);

  const recentActivity =
    (recentActivityResult.data ?? []) as RecentActivityRecord[];

  const totalRecords = moduleCounts.reduce(
    (total, module) => total + module.count,
    0
  );

  return (
    <AppShell title="Dashboard" eyebrow="MVP Command Centre">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Sovereign Governance OS
        </p>

        <h1 className="mt-3 max-w-3xl text-3xl font-semibold text-white">
          Hapū Relational Infrastructure Dashboard
        </h1>

        <p className="mt-4 max-w-3xl text-stone-400">
          A live overview of the MVP database modules: records, relationships,
          governance activity, communications, tasks, and system activity.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Total Records
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {totalRecords}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Active Modules
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">
              {moduleCounts.length}
            </p>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              MVP Status
            </p>
            <p className="mt-3 text-3xl font-semibold text-white">Live</p>
          </div>
        </div>
      </section>

      {countErrors.length > 0 ? (
        <section className="mt-8 rounded-2xl border border-red-900 bg-red-950/40 p-5 text-sm text-red-300">
          <p className="font-semibold">Dashboard database warning</p>
          <div className="mt-3 grid gap-2">
            {countErrors.map((error) => (
              <p key={error}>{error}</p>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Module Record Counts
            </h2>
            <p className="mt-1 text-sm text-stone-400">
              Live counts pulled from Supabase using lightweight count queries.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-4">
          {moduleCounts.map((module) => (
            <a
              key={module.href}
              href={module.href}
              className="rounded-2xl border border-stone-800 bg-stone-950 p-5 transition hover:border-stone-600"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium text-stone-100">{module.label}</p>
                <p className="rounded-full border border-stone-700 px-3 py-1 text-sm text-stone-300">
                  {module.count}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
          <p className="mt-1 text-sm text-stone-400">
            Latest records from the activity log.
          </p>
        </div>

        {recentActivity.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No recent activity yet
            </h3>
            <p className="mt-2 text-sm text-stone-400">
              Activity will appear here once the system begins logging actions.
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Action</th>
                  <th className="px-4 py-3 font-medium">Entity</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>

              <tbody>
                {recentActivity.map((record) => (
                  <tr
                    key={record.id}
                    className="border-t border-stone-800 bg-stone-900"
                  >
                    <td className="px-4 py-4 text-stone-100">
                      {record.action}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.entity_type || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.description || "—"}
                    </td>
                    <td className="px-4 py-4 text-stone-300">
                      {record.created_at}
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