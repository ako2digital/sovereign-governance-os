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
  created_at: string;
};

const relatedRecordLinks = [
  {
    label: "Whakapapa",
    description: "View relationships connected to this person.",
    href: "/whakapapa",
  },
  {
    label: "Hui",
    description: "Future hui attendance and participation records.",
    href: "/hui",
  },
  {
    label: "Tasks",
    description: "Future actions assigned to this person.",
    href: "/tasks",
  },
  {
    label: "Activity",
    description: "Future audit trail for this person record.",
    href: "/activity",
  },
];

const linkedActions = [
  {
    label: "Add relationship",
    href: "/whakapapa/new",
  },
  {
    label: "Record hui attendance",
    href: "/hui",
  },
  {
    label: "Assign task",
    href: "/tasks",
  },
];

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function PeopleDetailPage({
  params,
}: PeopleDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("people")
    .select(
      `
      id,
      full_name,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const person = data as PersonRecord | null;

  return (
    <AppShell title="Person Detail" eyebrow="Core Records / People">
      <section className="grid gap-6">
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8">
          <a
            href="/people"
            className="text-sm font-medium text-stone-500 transition hover:text-white"
          >
            ← Back to People Register
          </a>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
            Person record
          </p>

          {error ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-red-300 md:text-5xl">
                Record could not be loaded.
              </h1>

              <p className="mt-5 text-sm leading-7 text-red-200/80">
                {error.message}
              </p>
            </>
          ) : !person ? (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Person not found.
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-400">
                No people record exists for this ID. Return to the register and
                select an existing record.
              </p>
            </>
          ) : (
            <>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                {person.full_name}
              </h1>

              <p className="mt-5 max-w-3xl text-base leading-8 text-stone-400">
                This person is an identity anchor inside the relational system.
                Future records can connect this person to whakapapa, whenua,
                marae, hui, decisions, tasks, documents, and activity history.
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
          <section className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6">
            <div className="border-b border-stone-800 pb-5">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-stone-500">
                Core details
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                Confirmed record fields
              </h2>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Full name
                </p>

                <p className="mt-3 text-lg font-semibold text-stone-200">
                  {person?.full_name ?? "Not available"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Status
                </p>

                <p className="mt-3 text-lg font-semibold text-green-400">
                  {person ? "Loaded" : "Unavailable"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Created
                </p>

                <p className="mt-3 text-lg font-semibold text-stone-200">
                  {person ? formatDate(person.created_at) : "Not available"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-stone-600">
                  Database
                </p>

                <p className="mt-3 text-lg font-semibold text-stone-200">
                  Supabase people table
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
          </section>

          <aside className="grid gap-6">
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
                  Person record viewed
                </p>

                <p className="mt-1 text-xs leading-5 text-stone-600">
                  This models the future activity log for this person record.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}