import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

async function createHui(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const huiDate = String(formData.get("hui_date") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const purpose = String(formData.get("purpose") || "").trim();
  const agenda = String(formData.get("agenda") || "").trim();
  const summary = String(formData.get("summary") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!title) {
    return;
  }

  const { data, error } = await supabase.from("hui").insert({
    title,
    hui_date: huiDate || null,
    location: location || null,
    purpose: purpose || null,
    agenda: agenda || null,
    summary: summary || null,
    notes: notes || null,
    status: status || null,
  }).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/hui/${data.id}`);
}

export default function AddHuiPage() {
  return (
    <AppShell title="Add Hui" eyebrow="Hui Module">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          New Hui Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">Add Hui</h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Create a hui record with its title, date, location, purpose, agenda,
          summary, notes, and current status.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Hui Details</h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Enter the confirmed hui information. Only the title is required
              at this stage.
            </p>
          </div>

          <Link
            href="/hui"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Hui
          </Link>
        </div>

        <form action={createHui} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="title"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              required
              placeholder="Example: Monthly hapū governance hui"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="hui_date"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Hui Date
              </label>

              <input
                id="hui_date"
                name="hui_date"
                type="date"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="text-sm font-medium text-[var(--muted-foreground)]"
              >
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                placeholder="Enter location"
                className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="purpose"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Purpose
            </label>

            <textarea
              id="purpose"
              name="purpose"
              rows={4}
              placeholder="Enter the purpose, kaupapa, or reason for this hui"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="agenda"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Agenda
            </label>

            <textarea
              id="agenda"
              name="agenda"
              rows={6}
              placeholder="Enter agenda items, discussion points, or proposed structure"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="summary"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Summary
            </label>

            <textarea
              id="summary"
              name="summary"
              rows={5}
              placeholder="Enter a short summary or context for this hui"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="notes"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={5}
              placeholder="Enter internal notes, preparation notes, or follow-up context"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Status
            </label>

            <select
              id="status"
              name="status"
              defaultValue=""
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
            >
              <option value="">Select status</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Create Hui
            </button>

            <Link
              href="/hui"
              className="rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </AppShell>
  );
}