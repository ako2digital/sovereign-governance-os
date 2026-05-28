"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type Person = {
  id: string;
  full_name: string;
};

export default function NewWhakapapaRelationshipPage() {
  const router = useRouter();

  const [people, setPeople] = useState<Person[]>([]);
  const [personAId, setPersonAId] = useState("");
  const [personBId, setPersonBId] = useState("");
  const [relationshipType, setRelationshipType] = useState("sibling");
  const [notes, setNotes] = useState("");
  const [visibilityStatus, setVisibilityStatus] = useState("private");

  const [isLoadingPeople, setIsLoadingPeople] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadPeople() {
      const { data, error } = await supabase
        .from("people")
        .select("id, full_name")
        .order("full_name", { ascending: true });

      if (error) {
        setErrorMessage(error.message);
        setIsLoadingPeople(false);
        return;
      }

      setPeople((data ?? []) as Person[]);
      setIsLoadingPeople(false);
    }

    loadPeople();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!personAId) {
      setErrorMessage("Person A is required.");
      return;
    }

    if (!personBId) {
      setErrorMessage("Person B is required.");
      return;
    }

    if (personAId === personBId) {
      setErrorMessage("Person A and Person B must be different people.");
      return;
    }

    if (!relationshipType.trim()) {
      setErrorMessage("Relationship type is required.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("whakapapa_relationships").insert({
      person_a_id: personAId,
      person_b_id: personBId,
      relationship_type: relationshipType.trim(),
      notes: notes.trim() || null,
      visibility_status: visibilityStatus,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/whakapapa");
    router.refresh();
  }

  return (
    <AppShell title="Add Whakapapa Relationship" eyebrow="Whakapapa Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Relational Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Whakapapa Relationship
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a basic relationship between two people. This is the first MVP
          layer for testing relational whakapapa records.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-3xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Person A
            </span>
            <select
              value={personAId}
              onChange={(event) => setPersonAId(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              disabled={isLoadingPeople}
            >
              <option value="">
                {isLoadingPeople ? "Loading people..." : "Select a person"}
              </option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Relationship type
            </span>
            <select
              value={relationshipType}
              onChange={(event) => setRelationshipType(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
            >
              <option value="sibling">Sibling</option>
              <option value="parent">Parent</option>
              <option value="child">Child</option>
              <option value="spouse">Spouse</option>
              <option value="ancestor">Ancestor</option>
              <option value="descendant">Descendant</option>
              <option value="other">Other</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Person B
            </span>
            <select
              value={personBId}
              onChange={(event) => setPersonBId(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              disabled={isLoadingPeople}
            >
              <option value="">
                {isLoadingPeople ? "Loading people..." : "Select a person"}
              </option>
              {people.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.full_name}
                </option>
              ))}
            </select>
          </label>

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
              placeholder="Add relationship context, source notes, or supporting explanation."
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
              disabled={isSubmitting || isLoadingPeople}
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Create Relationship"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/whakapapa")}
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
