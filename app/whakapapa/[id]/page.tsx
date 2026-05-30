import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type WhakapapaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

type WhakapapaRelationship = {
  id: string;
  person_a_id: string;
  person_b_id: string;
  relationship_type: string;
  notes: string | null;
  visibility_status: string | null;
  created_at: string;
};

export default async function WhakapapaDetailPage({
  params,
}: WhakapapaDetailPageProps) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("whakapapa_relationships")
    .select(
      `
      id,
      person_a_id,
      person_b_id,
      relationship_type,
      notes,
      visibility_status,
      created_at
    `
    )
    .eq("id", id)
    .maybeSingle();

  const relationship = data as WhakapapaRelationship | null;

  return (
    <AppShell title="Whakapapa Detail" eyebrow="Whakapapa Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <a
          href="/whakapapa"
          className="text-sm font-medium text-stone-400 transition hover:text-white"
        >
          ← Back to Whakapapa
        </a>

        <p className="mt-6 text-xs uppercase tracking-[0.25em] text-stone-500">
          Whakapapa Relationship Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          {relationship?.relationship_type || "Whakapapa Detail"}
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          View the selected whakapapa relationship record from the hapū
          relational infrastructure database.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : !relationship ? (
          <div className="rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h2 className="text-base font-semibold text-white">
              Whakapapa relationship not found
            </h2>
            <p className="mt-2 text-sm text-stone-400">
              No whakapapa relationship record exists for this ID.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Core Details
              </h2>
              <p className="mt-1 text-sm text-stone-400">
                Confirmed fields from the whakapapa_relationships table.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Relationship Type
                </p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {relationship.relationship_type}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Visibility
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {relationship.visibility_status || "private"}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
                <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                  Created
                </p>
                <p className="mt-3 text-sm text-stone-300">
                  {relationship.created_at}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Notes
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm text-stone-300">
                {relationship.notes || "—"}
              </p>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Related Person IDs
              </p>

              <div className="mt-4 grid gap-3 text-sm text-stone-300">
                <p>
                  <span className="text-stone-500">Person A ID:</span>{" "}
                  <span className="break-all">
                    {relationship.person_a_id}
                  </span>
                </p>

                <p>
                  <span className="text-stone-500">Person B ID:</span>{" "}
                  <span className="break-all">
                    {relationship.person_b_id}
                  </span>
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Record ID
              </p>
              <p className="mt-3 break-all text-sm text-stone-300">
                {relationship.id}
              </p>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}