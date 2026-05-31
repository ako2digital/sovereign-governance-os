import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type MaraeRecord = {
  id: string;
  name?: string | null;
  title?: string | null;
  location?: string | null;
  created_at?: string | null;
};

type WhenuaRecord = {
  id: string;
  title: string | null;
  block_name: string | null;
  location: string | null;
  created_at: string | null;
};

async function createGovernanceRecord(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const recordType = String(formData.get("record_type") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const effectiveDate = String(formData.get("effective_date") || "").trim();
  const relatedMaraeId = String(formData.get("related_marae_id") || "").trim();
  const relatedWhenuaId = String(
    formData.get("related_whenua_id") || ""
  ).trim();

  if (!title) {
    return;
  }

  const { error } = await supabase.from("governance_records").insert({
    title,
    record_type: recordType || null,
    summary: summary || null,
    status: status || null,
    effective_date: effectiveDate || null,
    related_marae_id: relatedMaraeId || null,
    related_whenua_id: relatedWhenuaId || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/governance");
}

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

function whenuaPath(id: string) {
  return `/whenua/${id}`;
}

function getMaraeName(record: MaraeRecord) {
  return record.name || record.title || "Untitled marae record";
}

function getWhenuaTitle(record: WhenuaRecord) {
  return record.title || "Untitled whenua record";
}

export default async function AddGovernancePage() {
  const { data: maraeData, error: maraeError } = await supabase
    .from("marae_records")
    .select("*")
    .order("created_at", { ascending: false });

  const { data: whenuaData, error: whenuaError } = await supabase
    .from("whenua_records")
    .select(
      `
      id,
      title,
      block_name,
      location,
      created_at
    `
    )
    .order("created_at", { ascending: false });

  const maraeRecords = (maraeData ?? []) as MaraeRecord[];
  const whenuaRecords = (whenuaData ?? []) as WhenuaRecord[];

  return (
    <AppShell title="Add Governance" eyebrow="Governance Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Governance Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Governance
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a governance record with its title, type, summary, status,
          effective date, and optional links to existing marae or whenua
          records.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Governance Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Enter the confirmed governance information. Only the title is
              required at this stage.
            </p>
          </div>

          <Link
            href="/governance"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Back to Governance
          </Link>
        </div>

        {maraeError || whenuaError ? (
          <div className="mt-6 grid gap-4">
            {maraeError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Marae database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {maraeError.message}
                </pre>
              </div>
            ) : null}

            {whenuaError ? (
              <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
                <p className="font-semibold">Whenua database error</p>
                <pre className="mt-3 whitespace-pre-wrap">
                  {whenuaError.message}
                </pre>
              </div>
            ) : null}
          </div>
        ) : null}

        <form action={createGovernanceRecord} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-stone-300"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Hapū data governance mandate"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="record_type"
                className="text-sm font-medium text-stone-300"
              >
                Record Type
              </label>

              <input
                id="record_type"
                name="record_type"
                type="text"
                placeholder="Example: mandate, policy, resolution, authority record"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
              />
            </div>

            <div>
              <label
                htmlFor="effective_date"
                className="text-sm font-medium text-stone-300"
              >
                Effective Date
              </label>

              <input
                id="effective_date"
                name="effective_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="summary"
              className="text-sm font-medium text-stone-300"
            >
              Summary
            </label>

            <textarea
              id="summary"
              name="summary"
              rows={6}
              placeholder="Enter the governance summary, decision context, mandate explanation, or authority notes"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="text-sm font-medium text-stone-300"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
            >
              <option value="">Select status</option>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="under review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="related_marae_id"
                className="text-sm font-medium text-stone-300"
              >
                Related Marae
              </label>

              <select
                id="related_marae_id"
                name="related_marae_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No related marae</option>

                {maraeRecords.map((marae) => (
                  <option key={marae.id} value={marae.id}>
                    {getMaraeName(marae)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="related_whenua_id"
                className="text-sm font-medium text-stone-300"
              >
                Related Whenua
              </label>

              <select
                id="related_whenua_id"
                name="related_whenua_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No related whenua</option>

                {whenuaRecords.map((whenua) => (
                  <option key={whenua.id} value={whenua.id}>
                    {getWhenuaTitle(whenua)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Create Governance Record
            </button>

            <Link
              href="/governance"
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Available Marae
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Existing marae records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {maraeRecords.length} records
            </div>
          </div>

          {maraeRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
              <h3 className="text-base font-semibold text-white">
                No marae records available
              </h3>

              <p className="mt-2 text-sm text-stone-400">
                Add marae records before linking them to governance records.
              </p>

              <div className="mt-5">
                <Link
                  href="/marae/new"
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add Marae
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {maraeRecords.map((marae) => (
                    <tr
                      key={marae.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={maraePath(marae.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {getMaraeName(marae)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(marae.location)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={maraePath(marae.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View marae
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Available Whenua
              </h2>

              <p className="mt-1 text-sm text-stone-400">
                Existing whenua records available for optional selection.
              </p>
            </div>

            <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
              {whenuaRecords.length} records
            </div>
          </div>

          {whenuaRecords.length === 0 ? (
            <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
              <h3 className="text-base font-semibold text-white">
                No whenua records available
              </h3>

              <p className="mt-2 text-sm text-stone-400">
                Add whenua records before linking them to governance records.
              </p>

              <div className="mt-5">
                <Link
                  href="/whenua/new"
                  className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
                >
                  Add Whenua
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
              <table className="w-full min-w-[620px] border-collapse text-left text-sm">
                <thead className="bg-stone-950 text-stone-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Block</th>
                    <th className="px-4 py-3 font-medium">Location</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                  </tr>
                </thead>

                <tbody>
                  {whenuaRecords.map((whenua) => (
                    <tr
                      key={whenua.id}
                      className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                    >
                      <td className="px-4 py-4">
                        <Link
                          href={whenuaPath(whenua.id)}
                          className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          {getWhenuaTitle(whenua)}
                        </Link>
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(whenua.block_name)}
                      </td>

                      <td className="px-4 py-4 text-stone-300">
                        {formatValue(whenua.location)}
                      </td>

                      <td className="px-4 py-4">
                        <Link
                          href={whenuaPath(whenua.id)}
                          className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                        >
                          View whenua
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </AppShell>
  );
}