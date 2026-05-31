import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MinutesDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type MinutesRecord = {
  id: string;
  title?: string | null;
  hui_id?: string | null;
  related_hui_id?: string | null;
  date?: string | null;
  minutes_date?: string | null;
  summary?: string | null;
  content?: string | null;
  notes?: string | null;
  status?: string | null;
  approved_at?: string | null;
  created_at?: string | null;
};

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  agenda?: string | null;
  purpose?: string | null;
  summary?: string | null;
  notes?: string | null;
  status?: string | null;
  created_at?: string | null;
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

function minutesPath(id: string) {
  return `/minutes/${id}`;
}

function huiPath(id: string) {
  return `/hui/${id}`;
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

export default async function MinutesDetailPage({
  params,
}: MinutesDetailPageProps) {
  const { id } = await params;

  const { data: minutesData, error: minutesError } = await supabase
    .from("minutes")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const minutes = minutesData as MinutesRecord | null;

  const linkedHuiId = minutes?.hui_id || minutes?.related_hui_id || null;

  const { data: huiData, error: huiError } = linkedHuiId
    ? await supabase
        .from("hui")
        .select("*")
        .eq("id", linkedHuiId)
        .maybeSingle()
    : { data: null, error: null };

  const linkedHui = huiData as HuiRecord | null;

  const minutesTitle = minutes?.title || "Untitled minutes record";
  const minutesDate = minutes?.minutes_date || minutes?.date || null;

  const linkedHuiTitle = linkedHui?.title || "Untitled hui record";
  const linkedHuiDate = linkedHui?.hui_date || linkedHui?.date || null;

  return (
    <AppShell title="Minutes Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Minutes Record
        </p>

        {minutesError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {minutesError.message}
            </pre>
          </>
        ) : !minutes ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Minutes record not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No minutes record exists for this ID. Return to the minutes
              register and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {minutesTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected minutes record and only the
              records actually linked to it through confirmed database fields.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Minutes Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase minutes table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/minutes"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to Minutes
            </Link>

            <Link
              href="/minutes/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Minutes
            </Link>
          </div>
        </div>

        {minutes ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Title" darker>
                  <p className="font-medium text-stone-100">
                    {minutesTitle}
                  </p>
                </FieldRow>

                <FieldRow label="Minutes ID">
                  <Link
                    href={minutesPath(minutes.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {minutes.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Date" darker>
                  {formatDate(minutesDate)}
                </FieldRow>

                {minutes.hui_id !== undefined ? (
                  <FieldRow label="Hui ID">
                    {minutes.hui_id && linkedHui ? (
                      <Link
                        href={huiPath(minutes.hui_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {minutes.hui_id}
                      </Link>
                    ) : (
                      formatValue(minutes.hui_id)
                    )}
                  </FieldRow>
                ) : null}

                {minutes.related_hui_id !== undefined ? (
                  <FieldRow label="Related Hui ID">
                    {minutes.related_hui_id && linkedHui ? (
                      <Link
                        href={huiPath(minutes.related_hui_id)}
                        className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {minutes.related_hui_id}
                      </Link>
                    ) : (
                      formatValue(minutes.related_hui_id)
                    )}
                  </FieldRow>
                ) : null}

                {minutes.summary !== undefined ? (
                  <FieldRow label="Summary" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(minutes.summary)}
                    </p>
                  </FieldRow>
                ) : null}

                {minutes.content !== undefined ? (
                  <FieldRow label="Content">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(minutes.content)}
                    </p>
                  </FieldRow>
                ) : null}

                {minutes.notes !== undefined ? (
                  <FieldRow label="Notes" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(minutes.notes)}
                    </p>
                  </FieldRow>
                ) : null}

                {minutes.status !== undefined ? (
                  <FieldRow label="Status">
                    {formatValue(minutes.status)}
                  </FieldRow>
                ) : null}

                {minutes.approved_at !== undefined ? (
                  <FieldRow label="Approved At" darker>
                    {formatDate(minutes.approved_at)}
                  </FieldRow>
                ) : null}

                <FieldRow label="Created">
                  {formatDate(minutes.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No minutes record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The minutes record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {huiError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Hui link error</p>
            <pre className="mt-3 whitespace-pre-wrap">{huiError.message}</pre>
          </div>
        </section>
      ) : linkedHui ? (
        <>
          <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Linked Hui Record
                </h2>

                <p className="mt-1 text-sm text-stone-400">
                  This hui is directly linked to the current minutes record.
                </p>
              </div>

              <Link
                href={huiPath(linkedHui.id)}
                className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Open Hui
              </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
              <table className="w-full border-collapse text-left text-sm">
                <tbody>
                  <FieldRow label="Title" darker>
                    <Link
                      href={huiPath(linkedHui.id)}
                      className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {linkedHuiTitle}
                    </Link>
                  </FieldRow>

                  <FieldRow label="Hui ID">
                    <Link
                      href={huiPath(linkedHui.id)}
                      className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                    >
                      {linkedHui.id}
                    </Link>
                  </FieldRow>

                  <FieldRow label="Date" darker>
                    {formatDate(linkedHuiDate)}
                  </FieldRow>

                  <FieldRow label="Location">
                    {formatValue(linkedHui.location)}
                  </FieldRow>

                  {linkedHui.purpose !== undefined ? (
                    <FieldRow label="Purpose" darker>
                      <p className="whitespace-pre-wrap leading-6">
                        {formatValue(linkedHui.purpose)}
                      </p>
                    </FieldRow>
                  ) : null}

                  {linkedHui.status !== undefined ? (
                    <FieldRow label="Status">
                      {formatValue(linkedHui.status)}
                    </FieldRow>
                  ) : null}
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
                  Only actual linked records are shown here.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <Link
                href={huiPath(linkedHui.id)}
                className="rounded-xl border border-stone-800 bg-stone-950 p-4 transition hover:border-stone-600 hover:bg-stone-900"
              >
                <h3 className="text-sm font-semibold text-white">
                  {linkedHuiTitle}
                </h3>

                <p className="mt-1 text-sm text-stone-400">
                  Open linked hui record.
                </p>

                <p className="mt-4 font-mono text-xs text-stone-600">
                  {linkedHui.id}
                </p>
              </Link>
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}