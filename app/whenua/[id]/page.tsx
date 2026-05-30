import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhenuaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  legal_description: string | null;
  external_reference: string | null;
  historical_notes: string | null;
  status: string | null;
  sensitivity_level: string | null;
  created_at: string | null;
};

const relatedRecordLinks = [
  {
    label: "Documents",
    description: "Evidence, maps, title records, letters, and supporting files.",
    href: "/documents",
  },
  {
    label: "Governance",
    description: "Mandates, authority, decisions, and whenua-related governance.",
    href: "/governance",
  },
  {
    label: "Marae",
    description: "Future marae records connected to this whenua.",
    href: "/marae",
  },
  {
    label: "Activity",
    description: "Future audit trail for this whenua record.",
    href: "/activity",
  },
];

const linkedActions = [
  {
    label: "Attach document",
    href: "/documents",
  },
  {
    label: "Create decision",
    href: "/decisions",
  },
  {
    label: "Create task",
    href: "/tasks",
  },
];

function formatDate(date?: string | null) {
  if (!date) {
    return "Date unavailable";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatValue(value?: string | null) {
  if (!value) {
    return "Not recorded";
  }

  return value;
}

function statusClass(status?: string | null) {
  if (status === "active") {
    return "text-green-400";
  }

  if (status === "under_review") {
    return "text-stone-100";
  }

  if (status === "archived") {
    return "text-stone-500";
  }

  return "text-stone-300";
}

function sensitivityClass(level?: string | null) {
  if (level === "restricted") {
    return "text-red-300";
  }

  if (level === "sensitive") {
    return "text-yellow-300";
  }

  return "text-stone-300";
}

export default async function WhenuaDetailPage({
  params,
}: WhenuaDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("whenua_records")
    .select(
      `
      id,
      title,
      block_name,
      location,
      legal_description,
      external_reference,
      historical_notes,
      status,
      sensitivity_level,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const record = data as WhenuaRecord | null;

  return (
    <AppShell title="Whenua Detail" eyebrow="Core Records / Whenua">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/whenua"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to Whenua Records
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Whenua record
          </p>

          {error ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-red-300 md:text-5xl">
                Whenua record could not be loaded.
              </h1>

              <p className="mt-5 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </>
          ) : !record ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Whenua record not found.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
                No whenua record exists for this ID. Return to the whenua
                register and select an existing record.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {record.title || "Untitled whenua record"}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                This whenua record holds land, location, legal, historical, and
                reference information. It should later connect to documents,
                governance decisions, marae, tasks, and activity history.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {linkedActions.map((action, index) => (
                  <a
                    key={action.label}
                    href={action.href}
                    className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                      index === 0
                        ? "bg-stone-100 text-stone-950 hover:bg-white"
                        : "border border-stone-700 text-stone-300 hover:border-stone-500 hover:text-white"
                    }`}
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
          <section className="grid gap-6">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <div className="border-b border-stone-800 pb-5">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Core details
                </p>

                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Confirmed whenua fields
                </h2>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Title
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {formatValue(record?.title)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Block name
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {formatValue(record?.block_name)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Location
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {formatValue(record?.location)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    External reference
                  </p>

                  <p className="mt-3 break-all text-lg font-semibold text-stone-200">
                    {formatValue(record?.external_reference)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Status
                  </p>

                  <p
                    className={`mt-3 text-lg font-semibold ${statusClass(
                      record?.status
                    )}`}
                  >
                    {formatValue(record?.status)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Sensitivity
                  </p>

                  <p
                    className={`mt-3 text-lg font-semibold ${sensitivityClass(
                      record?.sensitivity_level
                    )}`}
                  >
                    {formatValue(record?.sensitivity_level)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Created
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    {formatDate(record?.created_at)}
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Database
                  </p>

                  <p className="mt-3 text-lg font-semibold text-stone-200">
                    whenua_records
                  </p>
                </div>

                <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5 md:col-span-2">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                    Record ID
                  </p>

                  <p className="mt-3 break-all font-mono text-sm text-stone-300">
                    {id}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Legal description
                </p>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-stone-400">
                  {formatValue(record?.legal_description)}
                </p>
              </div>

              <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                  Historical notes
                </p>

                <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-stone-400">
                  {formatValue(record?.historical_notes)}
                </p>
              </div>
            </div>
          </section>

          <aside className="grid gap-6 content-start">
            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Related records
              </p>

              <div className="mt-5 grid gap-3">
                {relatedRecordLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="rounded-2xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
                  >
                    <p className="text-sm font-semibold text-white">
                      {link.label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-stone-600">
                      {link.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Activity
              </p>

              <div className="mt-5 rounded-2xl border border-stone-800 bg-stone-950 p-4">
                <p className="text-sm font-semibold text-white">
                  Whenua record viewed
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-600">
                  This models the future activity log for this whenua record.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}