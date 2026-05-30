"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PersonRecord = {
  id: string;
  full_name: string;
};

type HuiRecord = {
  id: string;
  title: string;
};

type DecisionRecord = {
  id: string;
  title: string;
};

type DocumentRecord = {
  id: string;
  title: string;
};

type WhenuaRecord = {
  id: string;
  title: string;
};

export default function NewTaskRecordPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("normal");
  const [dueDate, setDueDate] = useState("");

  const [assignedToId, setAssignedToId] = useState("");
  const [relatedHuiId, setRelatedHuiId] = useState("");
  const [relatedDecisionId, setRelatedDecisionId] = useState("");
  const [relatedDocumentId, setRelatedDocumentId] = useState("");
  const [relatedWhenuaId, setRelatedWhenuaId] = useState("");

  const [peopleRecords, setPeopleRecords] = useState<PersonRecord[]>([]);
  const [huiRecords, setHuiRecords] = useState<HuiRecord[]>([]);
  const [decisionRecords, setDecisionRecords] = useState<DecisionRecord[]>([]);
  const [documentRecords, setDocumentRecords] = useState<DocumentRecord[]>([]);
  const [whenuaRecords, setWhenuaRecords] = useState<WhenuaRecord[]>([]);

  const [isLoadingRelations, setIsLoadingRelations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRelations() {
      const [
        peopleResult,
        huiResult,
        decisionResult,
        documentResult,
        whenuaResult,
      ] = await Promise.all([
        supabase.from("people").select("id, full_name").order("full_name", {
          ascending: true,
        }),
        supabase.from("hui").select("id, title").order("title", {
          ascending: true,
        }),
        supabase.from("decisions").select("id, title").order("title", {
          ascending: true,
        }),
        supabase.from("documents").select("id, title").order("title", {
          ascending: true,
        }),
        supabase.from("whenua_records").select("id, title").order("title", {
          ascending: true,
        }),
      ]);

      if (peopleResult.error) {
        setErrorMessage(peopleResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (huiResult.error) {
        setErrorMessage(huiResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (decisionResult.error) {
        setErrorMessage(decisionResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (documentResult.error) {
        setErrorMessage(documentResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (whenuaResult.error) {
        setErrorMessage(whenuaResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      setPeopleRecords((peopleResult.data ?? []) as PersonRecord[]);
      setHuiRecords((huiResult.data ?? []) as HuiRecord[]);
      setDecisionRecords((decisionResult.data ?? []) as DecisionRecord[]);
      setDocumentRecords((documentResult.data ?? []) as DocumentRecord[]);
      setWhenuaRecords((whenuaResult.data ?? []) as WhenuaRecord[]);
      setIsLoadingRelations(false);
    }

    loadRelations();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!title.trim()) {
      setErrorMessage("Title is required.");
      return;
    }

    setIsSubmitting(true);

    const { error } = await supabase.from("tasks").insert({
      title: title.trim(),
      description: description.trim() || null,
      status,
      priority,
      due_date: dueDate || null,
      assigned_to_id: assignedToId || null,
      related_hui_id: relatedHuiId || null,
      related_decision_id: relatedDecisionId || null,
      related_document_id: relatedDocumentId || null,
      related_whenua_id: relatedWhenuaId || null,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/tasks");
    router.refresh();
  }

  return (
    <AppShell title="Add Task Record" eyebrow="Tasks Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Task Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Task Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create an action item connected to people, hui, decisions, documents,
          or whenua.
        </p>
      </section>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-4xl rounded-2xl border border-stone-800 bg-stone-900 p-6"
      >
        <div className="grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">Title</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Example: Follow up whenua document"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-4">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In progress</option>
                <option value="blocked">Blocked</option>
                <option value="done">Done</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Priority
              </span>
              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              >
                <option value="low">Low</option>
                <option value="normal">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Assigned to
              </span>
              <select
                value={assignedToId}
                onChange={(event) => setAssignedToId(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                disabled={isLoadingRelations}
              >
                <option value="">
                  {isLoadingRelations ? "Loading people..." : "None"}
                </option>

                {peopleRecords.map((record) => (
                  <option key={record.id} value={record.id}>
                    {record.full_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Due date
              </span>
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              />
            </label>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <h2 className="text-sm font-semibold text-stone-100">
              Related records
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Optional links. Select the records this task relates to.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-200">
                  Related hui
                </span>
                <select
                  value={relatedHuiId}
                  onChange={(event) => setRelatedHuiId(event.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                  disabled={isLoadingRelations}
                >
                  <option value="">
                    {isLoadingRelations ? "Loading hui..." : "None"}
                  </option>

                  {huiRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-200">
                  Related decision
                </span>
                <select
                  value={relatedDecisionId}
                  onChange={(event) => setRelatedDecisionId(event.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                  disabled={isLoadingRelations}
                >
                  <option value="">
                    {isLoadingRelations ? "Loading decisions..." : "None"}
                  </option>

                  {decisionRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-200">
                  Related document
                </span>
                <select
                  value={relatedDocumentId}
                  onChange={(event) => setRelatedDocumentId(event.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                  disabled={isLoadingRelations}
                >
                  <option value="">
                    {isLoadingRelations ? "Loading documents..." : "None"}
                  </option>

                  {documentRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-200">
                  Related whenua
                </span>
                <select
                  value={relatedWhenuaId}
                  onChange={(event) => setRelatedWhenuaId(event.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                  disabled={isLoadingRelations}
                >
                  <option value="">
                    {isLoadingRelations ? "Loading whenua..." : "None"}
                  </option>

                  {whenuaRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-40 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Describe the action, follow-up, or operational task."
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
              disabled={isSubmitting || isLoadingRelations}
              className="rounded-xl bg-stone-100 px-5 py-3 text-sm font-semibold text-stone-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Saving..." : "Create Task Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/tasks")}
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