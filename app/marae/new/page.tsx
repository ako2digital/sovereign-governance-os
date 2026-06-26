import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

async function createMarae(formData: FormData) {
  "use server";

  const name = String(formData.get("name") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const status = String(formData.get("status") || "").trim();

  if (!name) {
    return;
  }

  const { data, error } = await supabase.from("marae_records").insert({
    name,
    location: location || null,
    description: description || null,
    notes: notes || null,
    status: status || null,
  }).select("id").single();

  if (error) {
    throw new Error(error.message);
  }

  redirect(`/marae/${data.id}`);
}

export default function AddMaraePage() {
  return (
    <AppShell title="Add Marae" eyebrow="Marae Module">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
          New Marae Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[var(--foreground)]">
          Add Marae
        </h1>

        <p className="mt-4 max-w-2xl text-[var(--muted-foreground)]">
          Create a marae record with its name, location, description, notes,
          and current status.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              Marae Details
            </h2>

            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              Enter the confirmed marae information. Only the name is required
              at this stage.
            </p>
          </div>

          <Link
            href="/marae"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Back to Marae
          </Link>
        </div>

        <form action={createMarae} className="mt-6 grid gap-5">
          <div>
            <label
              htmlFor="name"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Marae Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Enter marae name"
              className="mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
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

          <div>
            <label
              htmlFor="description"
              className="text-sm font-medium text-[var(--muted-foreground)]"
            >
              Description
            </label>

            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Enter marae description, background, or important context"
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
              placeholder="Enter internal notes, follow-up items, or supporting context"
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
              <option value="active">Active</option>
              <option value="under review">Under Review</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Create Marae
            </button>

            <Link
              href="/marae"
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