"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

export default function NewPersonPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("private");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!fullName.trim()) {
      setErrorMessage("Full name is required.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("people").insert({
      full_name: fullName.trim(),
      preferred_name: preferredName.trim() || null,
      email: email.trim() || null,
      phone: phone.trim() || null,
      notes: notes.trim() || null,
      visibility_status: visibilityStatus,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/people");
    router.refresh();
  }

  return (
    <AppShell title="Add Person" eyebrow="People Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add a Person
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a basic person record that can later connect to whakapapa,
          whenua, hui, documents, decisions, tasks, and activity history.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Full name
            </span>
            <input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Test Person"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Preferred name
            </span>
            <input
              value={preferredName}
              onChange={(event) => setPreferredName(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Test"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">Email</span>
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="test@example.com"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">Phone</span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="0200000000"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Visibility
            </span>
            <select
              value={visibilityStatus}
              onChange={(event) => setVisibilityStatus(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
            >
              <option value="private">Private</option>
              <option value="internal">Internal</option>
              <option value="public">Public</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Notes</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="min-h-32 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Add context, relationship notes, or record notes."
            />
          </label>

          {errorMessage ? (
            <div className="rounded-xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Create Person"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/people")}
              className="rounded-xl border border-stone-700 px-5 py-3 text-sm font-semibold text-stone-300 transition hover:border-stone-500 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </AppShell>
  );
}
