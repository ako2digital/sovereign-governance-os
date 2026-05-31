import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

async function createWhenua(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const blockName = String(formData.get("block_name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const legalDescription = String(
    formData.get("legal_description") || ""
  ).trim();
  const externalReference = String(
    formData.get("external_reference") || ""
  ).trim();
  const historicalNotes = String(
    formData.get("historical_notes") || ""
  ).trim();
  const status = String(formData.get("status") || "").trim();
  const sensitivityLevel = String(
    formData.get("sensitivity_level") || ""
  ).trim();

  if (!title) {
    return;
  }

  const { error } = await supabase.from("whenua_records").insert({
    title,
    block_name: blockName || null,
    location: location || null,
    legal_description: legalDescription || null,
    external_reference: externalReference || null,
    historical_notes: historicalNotes || null,
    status: status || null,
    sensitivity_level: sensitivityLevel || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/whenua");
}

export default function AddWhenuaPage() {
  return (
    <AppShell title="Add Whenua" eyebrow="Whenua Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Whenua Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Whenua
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a whenua record with its title, block name, location, legal
          description, historical notes, status, and sensitivity level.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Whenua Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Enter the confirmed land record information. Only the title is
              required at this stage.
            </p>
          </div>

          <Link
            href="/whenua"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Back to Whenua
          </Link>
        </div>

        <form action={createWhenua} className="mt-6 grid gap-5">
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
              placeholder="Example: Kaikohe Aerodrome whenua record"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="block_name"
                className="text-sm font-medium text-stone-300"
              >
                Block Name
              </label>

              <input
                id="block_name"
                name="block_name"
                type="text"
                placeholder="Enter block name"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="text-sm font-medium text-stone-300"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter location"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="legal_description"
              className="text-sm font-medium text-stone-300"
            >
              Legal Description
            </label>

            <textarea
              id="legal_description"
              name="legal_description"
              rows={4}
              placeholder="Enter legal description, title reference, survey reference, or known legal notes"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="external_reference"
              className="text-sm font-medium text-stone-300"
            >
              External Reference
            </label>

            <input
              id="external_reference"
              name="external_reference"
              type="text"
              placeholder="Enter URL, archive reference, council reference, LINZ reference, or source note"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="historical_notes"
              className="text-sm font-medium text-stone-300"
            >
              Historical Notes
            </label>

            <textarea
              id="historical_notes"
              name="historical_notes"
              rows={6}
              placeholder="Enter known history, acquisition context, whānau notes, evidence notes, or research direction"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
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
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="sensitivity_level"
                className="text-sm font-medium text-stone-300"
              >
                Sensitivity Level
              </label>

              <select
                id="sensitivity_level"
                name="sensitivity_level"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">Select sensitivity</option>
                <option value="public">Public</option>
                <option value="internal">Internal</option>
                <option value="restricted">Restricted</option>
                <option value="highly sensitive">Highly Sensitive</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Create Whenua
            </button>

            <Link
              href="/whenua"
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </AppShell>
  );
}