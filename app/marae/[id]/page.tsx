import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
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
  related_marae_id: string | null;
  created_at: string | null;
};

function formatValue(value?: string | null) {
  if (!value) {
    return "—";
  }

  return value;
}

function formatDate(date?: string | null) {
  if (!date) {
    return "—";
  }

  return new Date(date).toLocaleDateString("en-NZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function maraePath(id: string) {
  return `/marae/${id}`;
}

function governancePath(id: string) {
  return `/governance/${id}`;
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
      className={`border-t border-stone-800 ${
        darker ? "bg-stone-950" : "bg-stone-900"
      }`}
    >
      <th className="w-56 px-4 py-4 align-top font-medium text-stone-400">
        {label}
      </th>

      <td className="px-4 py-4 text-stone-300">{children}</td>
    </tr>
  );
}

export default async function MaraeDetailPage({
  params,
}: MaraeDetailPageProps) {
  const { id } = await params;

  const { data: maraeData, error: maraeError } = await supabase
    .from("marae_records")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const marae = maraeData as MaraeRecord | null;

  const { data: governanceData, error: governanceError } = await supabase
    .from("governance_records")
    .select(
      `
      id,
      title,
      record_type,
      summary,
      status,
      effective_date,
      related_marae_id,
      created_at
    `
    )
    .eq("related_marae_id", id)
    .order("created_at", { ascending: false });

  const linkedGovernanceRecords =
    (governanceData ?? []) as GovernanceRecord[];

  const maraeName =
    marae?.name || marae?.title || "Untitled marae record";

  return (
    <AppShell title="Marae Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Marae Record
        </p>

        {maraeError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {maraeError.message}
            </pre>
          </>
        ) : !marae ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Marae record not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No marae record exists for this ID. Return to the marae register
              and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {maraeName}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected marae record and only the records
              that are actually linked to this marae through confirmed database
              relationships.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Marae Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase marae_records table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/marae"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Marae
            </Link>

            <Link
              href="/marae/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Marae
            </Link>
          </div>
        </div>

        {marae ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Name" darker>
                  <p className="font-medium text-stone-100">
                    {maraeName}
                  </p>
                </FieldRow>

                <FieldRow label="Marae ID">
                  <Link
                    href={maraePath(marae.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {marae.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Location" darker>
                  {formatValue(marae.location)}
                </FieldRow>

                <FieldRow label="Description">
                  <p className="whitespace-pre-wrap leading-6">
                    {formatValue(marae.description)}
                  </p>
                </FieldRow>

                {marae.notes !== undefined ? (
                  <FieldRow label="Notes" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(marae.notes)}
                    </p>
                  </FieldRow>
                ) : null}

                {marae.status !== undefined ? (
                  <FieldRow label="Status">
                    {formatValue(marae.status)}
                  </FieldRow>
                ) : null}

                <FieldRow label="Created" darker>
                  {formatDate(marae.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No marae record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The marae record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {governanceError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {governanceError.message}
            </pre>
          </div>
        </section>
      ) : linkedGovernanceRecords.length > 0 ? (
        <>
          <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Linked Governance Records
                </h2>

                <p className="mt-1 text-sm text-stone-400">
                  Governance records directly linked to this marae record
                  through related_marae_id.
                </p>
              </div>

              <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
                {linkedGovernanceRecords.length} linked records
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">
                      Effective Date
                    </th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {linkedGovernanceRecords.map((record) => (
                    <tr
                      key={record.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={governancePath(record.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {record.title || "Untitled governance record"}
                        </Link>

                        <p className="mt-1 font-mono text-xs text-stone-600">
                          {record.id}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(record.record_type)}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(record.status)}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatDate(record.effective_date)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={governancePath(record.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View governance
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Related Links
                </h2>

                <p className="mt-1 text-sm text-stone-400">
                  Only actual linked governance records are shown here.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {linkedGovernanceRecords.map((record) => (
                <Link
                  key={record.id}
                  href={governancePath(record.id)}
                  className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
                >
                  <h3 className="text-sm font-semibold text-white">
                    {record.title || "Untitled governance record"}
                  </h3>

                  <p className="mt-1 text-sm text-stone-400">
                    Open linked governance record.
                  </p>

                  <p className="mt-4 font-mono text-xs text-stone-600">
                    {record.id}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}