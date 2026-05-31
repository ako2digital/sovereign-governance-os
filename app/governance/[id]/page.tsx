import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type GovernanceDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type GovernanceRecord = {
  id: string;
  title: string | null;
  record_type: string | null;
  summary: string | null;
  status: string | null;
  effective_date: string | null;
  related_marae_id: string | null;
  related_whenua_id: string | null;
  created_at: string | null;
};

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  description?: string | null;
  created_at?: string | null;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  status: string | null;
  sensitivity_level: string | null;
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

function governancePath(id: string) {
  return `/governance/${id}`;
}

function maraePath(id: string) {
  return `/marae/${id}`;
}

function whenuaPath(id: string) {
  return `/whenua/${id}`;
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

export default async function GovernanceDetailPage({
  params,
}: GovernanceDetailPageProps) {
  const { id } = await params;

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
      related_whenua_id,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const governance = governanceData as GovernanceRecord | null;

  const relatedMaraeId = governance?.related_marae_id ?? null;
  const relatedWhenuaId = governance?.related_whenua_id ?? null;

  const { data: maraeData, error: maraeError } = relatedMaraeId
    ? await supabase
        .from("marae_records")
        .select("*")
        .eq("id", relatedMaraeId)
        .maybeSingle()
    : { data: null, error: null };

  const { data: whenuaData, error: whenuaError } = relatedWhenuaId
    ? await supabase
        .from("whenua_records")
        .select(
          `
          id,
          title,
          block_name,
          location,
          status,
          sensitivity_level,
          created_at
        `
        )
        .eq("id", relatedWhenuaId)
        .maybeSingle()
    : { data: null, error: null };

  const linkedMarae = maraeData as MaraeRecord | null;
  const linkedWhenua = whenuaData as WhenuaRecord | null;

  const governanceTitle =
    governance?.title || "Untitled governance record";

  const linkedMaraeName =
    linkedMarae?.name || linkedMarae?.title || "Untitled marae record";

  const linkedWhenuaTitle =
    linkedWhenua?.title || "Untitled whenua record";

  const hasActualRelatedLinks = Boolean(linkedMarae || linkedWhenua);

  return (
    <AppShell title="Governance Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Governance Record
        </p>

        {governanceError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {governanceError.message}
            </pre>
          </>
        ) : !governance ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Governance record not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No governance record exists for this ID. Return to the governance
              register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {governanceTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected governance record and only the
              records directly linked to it through confirmed database fields.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Governance Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase governance_records table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/governance"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Governance
            </Link>

            <Link
              href="/governance/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Governance
            </Link>
          </div>
        </div>

        {governance ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <p className="font-medium text-stone-100">
                    {formatValue(governance.title)}
                  </p>
                </FieldRow>

                <FieldRow label="Governance ID">
                  <Link
                    href={governancePath(governance.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {governance.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Record Type" darker>
                  {formatValue(governance.record_type)}
                </FieldRow>

                <FieldRow label="Status">
                  {formatValue(governance.status)}
                </FieldRow>

                <FieldRow label="Effective Date" darker>
                  {formatDate(governance.effective_date)}
                </FieldRow>

                <FieldRow label="Summary">
                  <p className="whitespace-pre-wrap leading-6">
                    {formatValue(governance.summary)}
                  </p>
                </FieldRow>

                <FieldRow label="Related Marae ID" darker>
                  {governance.related_marae_id ? (
                    linkedMarae ? (
                      <Link
                        href={maraePath(governance.related_marae_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {governance.related_marae_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-stone-500">
                        {governance.related_marae_id}
                      </span>
                    )
                  ) : (
                    "—"
                  )}
                </FieldRow>

                <FieldRow label="Related Whenua ID">
                  {governance.related_whenua_id ? (
                    linkedWhenua ? (
                      <Link
                        href={whenuaPath(governance.related_whenua_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {governance.related_whenua_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-stone-500">
                        {governance.related_whenua_id}
                      </span>
                    )
                  ) : (
                    "—"
                  )}
                </FieldRow>

                <FieldRow label="Created" darker>
                  {formatDate(governance.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No governance record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The governance record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {maraeError || whenuaError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 grid gap-4">
            {maraeError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Marae link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {maraeError.message}
                </pre>
              </div>
            ) : null}

            {whenuaError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Whenua link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {whenuaError.message}
                </pre>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {linkedMarae ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Marae Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This marae is directly linked through related_marae_id.
              </p>
            </div>

            <Link
              href={maraePath(linkedMarae.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Marae
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Name" darker>
                  <Link
                    href={maraePath(linkedMarae.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedMaraeName}
                  </Link>
                </FieldRow>

                <FieldRow label="Marae ID">
                  <Link
                    href={maraePath(linkedMarae.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedMarae.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Location" darker>
                  {formatValue(linkedMarae.location)}
                </FieldRow>

                <FieldRow label="Description">
                  <p className="whitespace-pre-wrap leading-6">
                    {formatValue(linkedMarae.description)}
                  </p>
                </FieldRow>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedWhenua ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Linked Whenua Record
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                This whenua is directly linked through related_whenua_id.
              </p>
            </div>

            <Link
              href={whenuaPath(linkedWhenua.id)}
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Open Whenua
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <Link
                    href={whenuaPath(linkedWhenua.id)}
                    className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedWhenuaTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Whenua ID">
                  <Link
                    href={whenuaPath(linkedWhenua.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {linkedWhenua.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Block Name" darker>
                  {formatValue(linkedWhenua.block_name)}
                </FieldRow>

                <FieldRow label="Location">
                  {formatValue(linkedWhenua.location)}
                </FieldRow>

                <FieldRow label="Status" darker>
                  {formatValue(linkedWhenua.status)}
                </FieldRow>

                <FieldRow label="Sensitivity Level">
                  {formatValue(linkedWhenua.sensitivity_level)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {governance && hasActualRelatedLinks ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Related Links
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Only records directly linked to this governance record are shown
                here.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {linkedMarae ? (
              <Link
                href={maraePath(linkedMarae.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedMaraeName}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked marae record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedMarae.id}
                </p>
              </Link>
            ) : null}

            {linkedWhenua ? (
              <Link
                href={whenuaPath(linkedWhenua.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedWhenuaTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked whenua record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedWhenua.id}
                </p>
              </Link>
            ) : null}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}