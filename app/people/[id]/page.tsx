import Link from "next/link";
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
  created_at: string | null;
};

type LinkedPerson = {
  full_name: string;
};

type WhakapapaRelationship = {
  id: string;
  person_a_id: string;
  person_b_id: string;
  relationship_type: string;
  created_at: string | null;
  person_a: LinkedPerson | null;
  person_b: LinkedPerson | null;
};

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

function personPath(id: string) {
  return `/people/${id}`;
}

function relationshipPath(id: string) {
  return `/whakapapa/${id}`;
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

export default async function PeopleDetailPage({
  params,
}: PeopleDetailPageProps) {
  const { id } = await params;

  const { data: personData, error: personError } = await supabase
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

  const person = personData as PersonRecord | null;

  const { data: relationshipData, error: relationshipError } = await supabase
    .from("whakapapa_relationships")
    .select(
      `
      id,
      person_a_id,
      person_b_id,
      relationship_type,
      created_at,
      person_a:person_a_id (
        full_name
      ),
      person_b:person_b_id (
        full_name
      )
    `
    )
    .or(`person_a_id.eq.${id},person_b_id.eq.${id}`)
    .order("created_at", { ascending: false });

  const relationships =
    (relationshipData ?? []) as unknown as WhakapapaRelationship[];

  const personName = person?.full_name || "Unknown person";

  return (
    <AppShell title="Person Detail" eyebrow="Core Records">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Person Record
        </p>

        {personError ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-red-300">
              Database error
            </h1>

            <pre className="mt-4 max-w-2xl whitespace-pre-wrap text-sm text-red-300">
              {personError.message}
            </pre>
          </>
        ) : !person ? (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              Person not found
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              No person record exists for this ID. Return to the people register
              and select an existing record.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-3 text-3xl font-semibold text-white">
              {personName}
            </h1>

            <p className="mt-4 max-w-2xl text-stone-400">
              This page displays the selected person record and only the records
              that are actually linked to this person through confirmed database
              relationships.
            </p>
          </>
        )}
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Person Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Confirmed fields from the Supabase people table.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/people"
              className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Back to People
            </Link>

            <Link
              href="/people/new"
              className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Add Person
            </Link>
          </div>
        </div>

        {person ? (
          <div className="mt-6 overflow-hidden rounded-2xl border border-stone-800">
            <table className="w-full border-collapse text-left text-sm">
              <tbody>
                <FieldRow label="Full Name" darker>
                  <p className="font-medium text-stone-100">
                    {person.full_name}
                  </p>
                </FieldRow>

                <FieldRow label="Person ID">
                  <Link
                    href={personPath(person.id)}
                    className="font-mono text-xs text-stone-400 underline-offset-4 transition hover:text-white hover:underline"
                  >
                    {person.id}
                  </Link>
                </FieldRow>

                <FieldRow label="Created" darker>
                  {formatDate(person.created_at)}
                </FieldRow>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No person record loaded
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              The person record could not be displayed.
            </p>
          </div>
        )}
      </section>

      {relationshipError ? (
        <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <h2 className="text-lg font-semibold text-white">
            Linked Records Error
          </h2>

          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">
              {relationshipError.message}
            </pre>
          </div>
        </section>
      ) : relationships.length > 0 ? (
        <>
          <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Linked Whakapapa Relationships
                </h2>

                <p className="mt-1 text-sm text-stone-400">
                  These are the confirmed whakapapa relationship records linked
                  to this person.
                </p>
              </div>

              <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
                {relationships.length} linked records
              </div>
            </div>

            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[860px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">First Person</th>
                    <th className="px-4 py-3 font-medium">Relationship</th>
                    <th className="px-4 py-3 font-medium">Second Person</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {relationships.map((relationship) => {
                    const firstPersonName =
                      relationship.person_a?.full_name || "Unknown person";

                    const secondPersonName =
                      relationship.person_b?.full_name || "Unknown person";

                    return (
                      <tr
                        key={relationship.id}
                        className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                      >
                        <td className="px-4 py-4">
                          <Link
                            href={personPath(relationship.person_a_id)}
                            className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                          >
                            {firstPersonName}
                          </Link>
                        </td>

                        <td className="px-4 py-4 text-stone-300">
                          {relationship.relationship_type}
                        </td>

                        <td className="px-4 py-4">
                          <Link
                            href={personPath(relationship.person_b_id)}
                            className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                          >
                            {secondPersonName}
                          </Link>
                        </td>

                        <td className="px-4 py-4 text-stone-300">
                          {formatDate(relationship.created_at)}
                        </td>

                        <td className="px-4 py-4">
                          <Link
                            href={relationshipPath(relationship.id)}
                            className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                          >
                            View relationship
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
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
              {relationships.map((relationship) => {
                const firstPersonName =
                  relationship.person_a?.full_name || "Unknown person";

                const secondPersonName =
                  relationship.person_b?.full_name || "Unknown person";

                const otherPersonId =
                  relationship.person_a_id === id
                    ? relationship.person_b_id
                    : relationship.person_a_id;

                const otherPersonName =
                  relationship.person_a_id === id
                    ? secondPersonName
                    : firstPersonName;

                return (
                  <div
                    key={relationship.id}
                    className="rounded-xl border border-stone-800 bg-stone-950 p-4"
                  >
                    <h3 className="text-sm font-semibold text-white">
                      {relationship.relationship_type}
                    </h3>

                    <p className="mt-1 text-sm text-stone-400">
                      Linked to {otherPersonName}.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={personPath(otherPersonId)}
                        className="rounded-lg border border-stone-700 px-3 py-2 text-xs font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                      >
                        Open person
                      </Link>

                      <Link
                        href={relationshipPath(relationship.id)}
                        className="rounded-lg border border-stone-700 px-3 py-2 text-xs font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
                      >
                        Open relationship
                      </Link>
                    </div>

                    <p className="mt-4 font-mono text-xs text-stone-600">
                      Relationship ID: {relationship.id}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      ) : null}
    </AppShell>
  );
}