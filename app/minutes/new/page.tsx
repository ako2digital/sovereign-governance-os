import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type HuiRecord = {
  id: string;
  title?: string | null;
  date?: string | null;
  hui_date?: string | null;
  location?: string | null;
  status?: string | null;
  created_at?: string | null;
};

async function createMinutes(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const relatedHuiId = String(formData.get("related_hui_id") || "").trim();
  const minutesDate = String(formData.get("minutes_date") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const content = String(formData.get("content") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const approvedAt = String(formData.get("approved_at") || "").trim();

  if (!title) {
    return;
  }

  const { data, error } = await supabase.from("minutes").insert({
    title,
    related_hui_id: relatedHuiId || null,
    minutes_date: minutesDate || null,
    summary: summary || null,
    content: content || null,
    notes: notes || null,
    status: status || null,
    approved_at: approvedAt || null,
  }).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/minutes/${data.id}`);
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

function huiPath(id: string) {
  return `/hui/${id}`;
}

function getHuiTitle(record: HuiRecord) {
  return record.title || "Untitled hui record";
}

function getHuiDate(record: HuiRecord) {
  return record.hui_date || record.date || null;
}

export default async function AddMinutesPage() {
  const { data, error } = await supabase
    .from("hui")
    .select("*")
    .order("created_at", { ascending: false });

  const huiRecords = (data ?? []) as HuiRecord[];

  return (
    <AppShell title="Add Minutes" eyebrow="Minutes Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          New Minutes Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Minutes
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a minutes record with its title, optional hui link, minutes
          date, summary, full content, notes, approval status, and approval date.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Minutes Details
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Enter the confirmed meeting documentation. Only the title is
              required at this stage.
            </p>
          </div>

          <Link
            href="/minutes"
            className="rounded-xl border border-stone-700 px-4 py-2 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
          >
            Back to Minutes
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            <p className="font-semibold">Hui database error</p>
            <pre className="mt-3 whitespace-pre-wrap">{error.message}</pre>
          </div>
        ) : null}

        <form action={createMinutes} className="mt-6 grid gap-5">
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
              placeholder="Example: Minutes for monthly hapū governance hui"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="related_hui_id"
                className="text-sm font-medium text-stone-300"
              >
                Related Hui
              </label>

              <select
                id="related_hui_id"
                name="related_hui_id"
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              >
                <option value="">No related hui</option>

                {huiRecords.map((hui) => (
                  <option key={hui.id} value={hui.id}>
                    {getHuiTitle(hui)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="minutes_date"
                className="text-sm font-medium text-stone-300"
              >
                Minutes Date
              </label>

              <input
                id="minutes_date"
                name="minutes_date"
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
              rows={5}
              placeholder="Enter a short summary of the minutes"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="content"
              className="text-sm font-medium text-stone-300"
            >
              Minutes Content
            </label>

            <textarea
              id="content"
              name="content"
              rows={8}
              placeholder="Enter full minutes, discussion notes, attendees, motions, decisions, or action points"
              className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-stone-600 focus:border-stone-400"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="text-sm font-medium text-stone-300"
            >
              Internal Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={5}
              placeholder="Enter internal notes, follow-up context, or review comments"
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
                <option value="under review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="approved_at"
                className="text-sm font-medium text-stone-300"
              >
                Approved Date
              </label>

              <input
                id="approved_at"
                name="approved_at"
                type="date"
                className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-sm text-white outline-none transition focus:border-stone-400"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white"
            >
              Create Minutes
            </button>

            <Link
              href="/minutes"
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>

      <section className="mt-8 rounded-2xl border border-stone-800 bg-stone-900 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Available Hui
            </h2>

            <p className="mt-1 text-sm text-stone-400">
              Existing hui records available for optional selection.
            </p>
          </div>

          <div className="rounded-full border border-stone-700 px-4 py-2 text-sm text-stone-300">
            {huiRecords.length} records
          </div>
        </div>

        {huiRecords.length === 0 ? (
          <div className="mt-6 rounded-xl border border-stone-800 bg-stone-950 p-6">
            <h3 className="text-base font-semibold text-white">
              No hui records available
            </h3>

            <p className="mt-2 text-sm text-stone-400">
              Add hui records before linking them to minutes records.
            </p>

            <div className="mt-5">
              <Link
                href="/hui/new"
                className="rounded-xl bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-950 transition hover:bg-white"
              >
                Add Hui
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-2xl border border-stone-800">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead className="bg-stone-950 text-stone-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Open</th>
                </tr>
              </thead>

              <tbody>
                {huiRecords.map((hui) => (
                  <tr
                    key={hui.id}
                    className="border-t border-stone-800 bg-stone-900 transition hover:bg-stone-950"
                  >
                    <td className="px-4 py-4">
                      <Link
                        href={huiPath(hui.id)}
                        className="font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        {getHuiTitle(hui)}
                      </Link>
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatDate(getHuiDate(hui))}
                    </td>

                    <td className="px-4 py-4 text-stone-300">
                      {formatValue(hui.location)}
                    </td>

                    <td className="px-4 py-4">
                      <Link
                        href={huiPath(hui.id)}
                        className="text-sm font-medium text-stone-100 underline-offset-4 transition hover:text-white hover:underline"
                      >
                        View hui
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
}