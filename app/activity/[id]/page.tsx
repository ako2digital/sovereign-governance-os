import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type ActivityDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ActivityRecord = {
  id: string;
  action?: string | null;
  event_type?: string | null;
  module?: string | null;
  table_name?: string | null;
  record_table?: string | null;
  record_type?: string | null;
  entity_type?: string | null;
  related_table?: string | null;
  record_id?: string | null;
  entity_id?: string | null;
  related_record_id?: string | null;
  person_id?: string | null;
  related_person_id?: string | null;
  actor_id?: string | null;
  actor_person_id?: string | null;
  description?: string | null;
  summary?: string | null;
  notes?: string | null;
  metadata?: unknown;
  created_at?: string | null;
};

type AnyLinkedRecord = {
  id: string;
  [key: string]: unknown;
};

type RecordConfig = {
  label: string;
  table: string;
  routeBase: string;
  titleFields: string[];
};

function formatValue(value?: unknown) {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
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

function activityPath(id: string) {
  return `/activity/${id}`;
}

function peoplePath(id: string) {
  return `/people/${id}`;
}

function normalizeKey(value?: string | null) {
  if (!value) {
    return "";
  }

  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function firstString(...values: Array<string | null | undefined>) {
  return values.find((value) => value && value.trim().length > 0) ?? null;
}

function getRecordConfig(value?: string | null): RecordConfig | null {
  const key = normalizeKey(value);

  switch (key) {
    case "person":
    case "people":
    case "peoplerecord":
    case "peoplemodule":
      return {
        label: "Person Record",
        table: "people",
        routeBase: "/people",
        titleFields: ["full_name", "title", "name"],
      };

    case "whakapapa":
    case "whakapaparelationship":
    case "whakapaparelationships":
      return {
        label: "Whakapapa Relationship",
        table: "whakapapa_relationships",
        routeBase: "/whakapapa",
        titleFields: ["relationship_type", "title", "name"],
      };

    case "whenua":
    case "whenuarecord":
    case "whenuarecords":
      return {
        label: "Whenua Record",
        table: "whenua_records",
        routeBase: "/whenua",
        titleFields: ["title", "block_name", "name"],
      };

    case "marae":
    case "maraerecord":
    case "maraerecords":
      return {
        label: "Marae Record",
        table: "marae_records",
        routeBase: "/marae",
        titleFields: ["name", "title"],
      };

    case "governance":
    case "governancerecord":
    case "governancerecords":
      return {
        label: "Governance Record",
        table: "governance_records",
        routeBase: "/governance",
        titleFields: ["title", "record_type", "name"],
      };

    case "hui":
    case "huirecord":
    case "huirecords":
      return {
        label: "Hui Record",
        table: "hui",
        routeBase: "/hui",
        titleFields: ["title", "name"],
      };

    case "minute":
    case "minutes":
    case "minutesrecord":
    case "minutesrecords":
      return {
        label: "Minutes Record",
        table: "minutes",
        routeBase: "/minutes",
        titleFields: ["title", "name"],
      };

    case "decision":
    case "decisions":
    case "decisionrecord":
    case "decisionrecords":
      return {
        label: "Decision Record",
        table: "decisions",
        routeBase: "/decisions",
        titleFields: ["title", "decision", "decision_text", "name"],
      };

    case "document":
    case "documents":
    case "documentrecord":
    case "documentrecords":
      return {
        label: "Document Record",
        table: "documents",
        routeBase: "/documents",
        titleFields: ["title", "name", "document_type"],
      };

    case "panui":
    case "panuirecord":
    case "panuirecords":
      return {
        label: "Pānui Record",
        table: "panui",
        routeBase: "/panui",
        titleFields: ["title", "message", "summary"],
      };

    case "task":
    case "tasks":
    case "taskrecord":
    case "taskrecords":
      return {
        label: "Task Record",
        table: "tasks",
        routeBase: "/tasks",
        titleFields: ["title", "name"],
      };

    case "activity":
    case "activitylog":
    case "activityrecord":
    case "activityrecords":
      return {
        label: "Activity Record",
        table: "activity_log",
        routeBase: "/activity",
        titleFields: ["action", "event_type", "title"],
      };

    default:
      return null;
  }
}

function getRecordTitle(record: AnyLinkedRecord | null, config: RecordConfig | null) {
  if (!record || !config) {
    return "Untitled linked record";
  }

  for (const field of config.titleFields) {
    const value = record[field];

    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }

  return "Untitled linked record";
}

function getRecordPath(config: RecordConfig, id: string) {
  return `${config.routeBase}/${id}`;
}

function isUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.startsWith("http://") || value.startsWith("https://");
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
      className={`border-t border-[var(--border)] ${
        darker ? "bg-[var(--surface-raised)]" : "bg-[var(--surface)]"
      }`}
    >
      <th className="w-56 px-4 py-4 align-top font-medium text-[var(--muted-foreground)]">
        {label}
      </th>

      <td className="px-4 py-4 text-[var(--foreground)]">{children}</td>
    </tr>
  );
}

export default async function ActivityDetailPage({
  params,
}: ActivityDetailPageProps) {
  const { id } = await params;

  const { data: activityData, error: activityError } = await supabase
    .from("activity_log")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const activity = activityData as ActivityRecord | null;

  const targetRecordType = firstString(
    activity?.record_table,
    activity?.table_name,
    activity?.record_type,
    activity?.entity_type,
    activity?.related_table,
    activity?.module
  );

  const targetRecordId = firstString(
    activity?.record_id,
    activity?.entity_id,
    activity?.related_record_id
  );

  const targetConfig = getRecordConfig(targetRecordType);

  const assignedPersonId = firstString(
    activity?.related_person_id,
    activity?.person_id,
    activity?.actor_person_id,
    activity?.actor_id
  );

  const externalUrl =
    typeof activity?.metadata === "object" &&
    activity?.metadata !== null &&
    "url" in activity.metadata &&
    typeof activity.metadata.url === "string"
      ? activity.metadata.url
      : null;

  const hasExternalUrl = isUrl(externalUrl);

  const { data: targetData, error: targetError } =
    targetConfig && targetRecordId
      ? await supabase
          .from(targetConfig.table)
          .select("*")
          .eq("id", targetRecordId)
          .maybeSingle()
      : { data: null, error: null };

  const { data: personData, error: personError } = assignedPersonId
    ? await supabase
        .from("people")
        .select("id, full_name, created_at")
        .eq("id", assignedPersonId)
        .maybeSingle()
    : { data: null, error: null };

  const linkedTargetRecord = targetData as AnyLinkedRecord | null;
  const linkedPersonRecord = personData as AnyLinkedRecord | null;

  const activityTitle =
    activity?.action ||
    activity?.event_type ||
    activity?.summary ||
    "Activity record";

  const targetTitle = getRecordTitle(linkedTargetRecord, targetConfig);

  const personName =
    typeof linkedPersonRecord?.full_name === "string"
      ? linkedPersonRecord.full_name
      : "Unknown person";

  const targetRoute =
    targetConfig && linkedTargetRecord
      ? getRecordPath(targetConfig, linkedTargetRecord.id)
      : null;

  const personRoute = linkedPersonRecord
    ? peoplePath(linkedPersonRecord.id)
    : null;

  const showPersonRelatedLink =
    Boolean(personRoute) && personRoute !== targetRoute;

  const hasActualRelatedLinks = Boolean(
    targetRoute || showPersonRelatedLink || hasExternalUrl
  );

  return (
    <AppShell title="Activity Detail" eyebrow="System Records">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          Activity Record
        </p>

        {activityError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {activityError.message}
            </pre>
          </>
        ) : !activity ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              Activity record not found
            </h1>

            <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
              No activity record exists for this ID. Return to the activity log
              and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
              {activityTitle}
            </h1>

            <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
              This page displays the selected activity record and only the
              records that are actually linked through confirmed IDs.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Activity Details
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Confirmed fields from the Supabase activity_log table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/activity"
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Back to Activity
            </Link>
          </div>
        </div>

        {activity ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Action" darker>
                  <p className="font-medium text-[var(--foreground)]">
                    {formatValue(activity.action || activity.event_type)}
                  </p>
                </FieldRow>

                <FieldRow label="Activity ID">
                  <Link
                    href={activityPath(activity.id)}
                    className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {activity.id}
                  </Link>
                </FieldRow>

                {activity.module !== undefined ? (
                  <FieldRow label="Module" darker>
                    {formatValue(activity.module)}
                  </FieldRow>
                ) : null}

                {activity.table_name !== undefined ? (
                  <FieldRow label="Table Name">
                    {formatValue(activity.table_name)}
                  </FieldRow>
                ) : null}

                {activity.record_table !== undefined ? (
                  <FieldRow label="Record Table" darker>
                    {formatValue(activity.record_table)}
                  </FieldRow>
                ) : null}

                {activity.record_type !== undefined ? (
                  <FieldRow label="Record Type">
                    {formatValue(activity.record_type)}
                  </FieldRow>
                ) : null}

                {activity.entity_type !== undefined ? (
                  <FieldRow label="Entity Type" darker>
                    {formatValue(activity.entity_type)}
                  </FieldRow>
                ) : null}

                {activity.record_id !== undefined ? (
                  <FieldRow label="Record ID">
                    {targetRoute ? (
                      <Link
                        href={targetRoute}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                      >
                        {activity.record_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(activity.record_id)}
                      </span>
                    )}
                  </FieldRow>
                ) : null}

                {activity.entity_id !== undefined ? (
                  <FieldRow label="Entity ID" darker>
                    {targetRoute ? (
                      <Link
                        href={targetRoute}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                      >
                        {activity.entity_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(activity.entity_id)}
                      </span>
                    )}
                  </FieldRow>
                ) : null}

                {activity.related_record_id !== undefined ? (
                  <FieldRow label="Related Record ID">
                    {targetRoute ? (
                      <Link
                        href={targetRoute}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                      >
                        {activity.related_record_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(activity.related_record_id)}
                      </span>
                    )}
                  </FieldRow>
                ) : null}

                {activity.person_id !== undefined ? (
                  <FieldRow label="Person ID" darker>
                    {personRoute ? (
                      <Link
                        href={personRoute}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                      >
                        {activity.person_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(activity.person_id)}
                      </span>
                    )}
                  </FieldRow>
                ) : null}

                {activity.related_person_id !== undefined ? (
                  <FieldRow label="Related Person ID">
                    {personRoute ? (
                      <Link
                        href={personRoute}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                      >
                        {activity.related_person_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(activity.related_person_id)}
                      </span>
                    )}
                  </FieldRow>
                ) : null}

                {activity.actor_person_id !== undefined ? (
                  <FieldRow label="Actor Person ID" darker>
                    {personRoute ? (
                      <Link
                        href={personRoute}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                      >
                        {activity.actor_person_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(activity.actor_person_id)}
                      </span>
                    )}
                  </FieldRow>
                ) : null}

                {activity.actor_id !== undefined ? (
                  <FieldRow label="Actor ID">
                    {personRoute ? (
                      <Link
                        href={personRoute}
                        className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                      >
                        {activity.actor_id}
                      </Link>
                    ) : (
                      <span className="font-mono text-xs text-[var(--muted-foreground)]">
                        {formatValue(activity.actor_id)}
                      </span>
                    )}
                  </FieldRow>
                ) : null}

                {activity.description !== undefined ? (
                  <FieldRow label="Description" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(activity.description)}
                    </p>
                  </FieldRow>
                ) : null}

                {activity.summary !== undefined ? (
                  <FieldRow label="Summary">
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(activity.summary)}
                    </p>
                  </FieldRow>
                ) : null}

                {activity.notes !== undefined ? (
                  <FieldRow label="Notes" darker>
                    <p className="whitespace-pre-wrap leading-6">
                      {formatValue(activity.notes)}
                    </p>
                  </FieldRow>
                ) : null}

                {activity.metadata !== undefined ? (
                  <FieldRow label="Metadata">
                    <pre className="whitespace-pre-wrap rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 font-mono text-xs leading-6 text-[var(--muted-foreground)]">
                      {formatValue(activity.metadata)}
                    </pre>
                  </FieldRow>
                ) : null}

                <FieldRow label="Created" darker>
                  {formatDate(activity.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-6">
            <h3 className="text-base font-semibold text-[var(--foreground)]">
              No activity record loaded
            </h3>

            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              The activity record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {targetError || personError ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Linked Records Error
          </h2>

          <div className="mt-6 grid gap-4">
            {targetError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Target record link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {targetError.message}
                </pre>
              </div>
            ) : null}

            {personError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Person link error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {personError.message}
                </pre>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {linkedTargetRecord && targetConfig ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Linked Target Record
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                This record is directly linked through the activity log target
                record ID.
              </p>
            </div>

            <Link
              href={getRecordPath(targetConfig, linkedTargetRecord.id)}
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Open Record
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Record Type" darker>
                  {targetConfig.label}
                </FieldRow>

                <FieldRow label="Title">
                  <Link
                    href={getRecordPath(targetConfig, linkedTargetRecord.id)}
                    className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {targetTitle}
                  </Link>
                </FieldRow>

                <FieldRow label="Record ID" darker>
                  <Link
                    href={getRecordPath(targetConfig, linkedTargetRecord.id)}
                    className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {linkedTargetRecord.id}
                  </Link>
                </FieldRow>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {linkedPersonRecord && showPersonRelatedLink ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Linked Person Record
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                This person is directly linked through the activity log person
                field.
              </p>
            </div>

            <Link
              href={peoplePath(linkedPersonRecord.id)}
              className="rounded-xl bg-[var(--foreground)] px-4 py-2 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Open Person
            </Link>
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Full Name" darker>
                  <Link
                    href={peoplePath(linkedPersonRecord.id)}
                    className="font-medium text-[var(--foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {personName}
                  </Link>
                </FieldRow>

                <FieldRow label="Person ID">
                  <Link
                    href={peoplePath(linkedPersonRecord.id)}
                    className="font-mono text-xs text-[var(--muted-foreground)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline"
                  >
                    {linkedPersonRecord.id}
                  </Link>
                </FieldRow>
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {activity && hasActualRelatedLinks ? (
        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Related Links
              </h2>

              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                Only records directly linked to this activity record are shown
                here.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {linkedTargetRecord && targetConfig ? (
              <Link
                href={getRecordPath(targetConfig, linkedTargetRecord.id)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {targetTitle}
                </h3>

                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Open linked {targetConfig.label.toLowerCase()}.
                </p>

                <p className="mt-4 font-mono text-xs text-[var(--muted-foreground)]">
                  {linkedTargetRecord.id}
                </p>
              </Link>
            ) : null}

            {linkedPersonRecord && showPersonRelatedLink ? (
              <Link
                href={peoplePath(linkedPersonRecord.id)}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  {personName}
                </h3>

                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Open linked person record.
                </p>

                <p className="mt-4 font-mono text-xs text-[var(--muted-foreground)]">
                  {linkedPersonRecord.id}
                </p>
              </Link>
            ) : null}

            {hasExternalUrl ? (
              <a
                href={externalUrl ?? "#"}
                target="_blank"
                rel="noreferrer"
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4 transition hover:border-[var(--accent)] hover:bg-[var(--surface)]"
              >
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  External URL
                </h3>

                <p className="mt-1 break-words text-sm text-[var(--muted-foreground)]">
                  Open linked external reference.
                </p>
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
    </AppShell>
  );
}