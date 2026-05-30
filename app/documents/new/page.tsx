"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type PersonRecord = {
  id: string;
  full_name: string;
};

type WhenuaRecord = {
  id: string;
  title: string;
};

type MaraeRecord = {
  id: string;
  name: string;
};

type HuiRecord = {
  id: string;
  title: string;
};

type DecisionRecord = {
  id: string;
  title: string;
};

export default function NewDocumentRecordPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [externalReference, setExternalReference] = useState("");
  const [sensitivityLevel, setSensitivityLevel] = useState("standard");
  const [status, setStatus] = useState("active");

  const [relatedPersonId, setRelatedPersonId] = useState("");
  const [relatedWhenuaId, setRelatedWhenuaId] = useState("");
  const [relatedMaraeId, setRelatedMaraeId] = useState("");
  const [relatedHuiId, setRelatedHuiId] = useState("");
  const [relatedDecisionId, setRelatedDecisionId] = useState("");

  const [peopleRecords, setPeopleRecords] = useState<PersonRecord[]>([]);
  const [whenuaRecords, setWhenuaRecords] = useState<WhenuaRecord[]>([]);
  const [maraeRecords, setMaraeRecords] = useState<MaraeRecord[]>([]);
  const [huiRecords, setHuiRecords] = useState<HuiRecord[]>([]);
  const [decisionRecords, setDecisionRecords] = useState<DecisionRecord[]>([]);

  const [isLoadingRelations, setIsLoadingRelations] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadRelations() {
      const [
        peopleResult,
        whenuaResult,
        maraeResult,
        huiResult,
        decisionResult,
      ] = await Promise.all([
        supabase.from("people").select("id, full_name").order("full_name", {
          ascending: true,
        }),
        supabase.from("whenua_records").select("id, title").order("title", {
          ascending: true,
        }),
        supabase.from("marae_records").select("id, name").order("name", {
          ascending: true,
        }),
        supabase.from("hui").select("id, title").order("title", {
          ascending: true,
        }),
        supabase.from("decisions").select("id, title").order("title", {
          ascending: true,
        }),
      ]);

      if (peopleResult.error) {
        setErrorMessage(peopleResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (whenuaResult.error) {
        setErrorMessage(whenuaResult.error.message);
        setIsLoadingRelations(false);
        return;
      }

      if (maraeResult.error) {
        setErrorMessage(maraeResult.error.message);
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

      setPeopleRecords((peopleResult.data ?? []) as PersonRecord[]);
      setWhenuaRecords((whenuaResult.data ?? []) as WhenuaRecord[]);
      setMaraeRecords((maraeResult.data ?? []) as MaraeRecord[]);
      setHuiRecords((huiResult.data ?? []) as HuiRecord[]);
      setDecisionRecords((decisionResult.data ?? []) as DecisionRecord[]);
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

    const { error } = await supabase.from("documents").insert({
      title: title.trim(),
      document_type: documentType.trim() || null,
      description: description.trim() || null,
      file_url: fileUrl.trim() || null,
      external_reference: externalReference.trim() || null,
      related_person_id: relatedPersonId || null,
      related_whenua_id: relatedWhenuaId || null,
      related_marae_id: relatedMaraeId || null,
      related_hui_id: relatedHuiId || null,
      related_decision_id: relatedDecisionId || null,
      sensitivity_level: sensitivityLevel,
      status,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/documents");
    router.refresh();
  }

  return (
    <AppShell title="Add Document Record" eyebrow="Documents Module">
      <section className="rounded-3xl border border-stone-800 bg-stone-900/50 p-8">
        <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
          Create Document Record
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-white">
          Add Document Record
        </h1>

        <p className="mt-4 max-w-2xl text-stone-400">
          Create a document reference connected to people, whenua, marae, hui,
          or decisions.
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
              placeholder="Example: Test Document"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Document type
              </span>
              <input
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="Example: Evidence, Minutes, Legal, Photo"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                External reference
              </span>
              <input
                value={externalReference}
                onChange={(event) => setExternalReference(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                placeholder="Example: TEST-DOC-001"
              />
            </label>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              File URL
            </span>
            <input
              value={fileUrl}
              onChange={(event) => setFileUrl(event.target.value)}
              className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Paste a document, image, or storage link"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Sensitivity level
              </span>
              <select
                value={sensitivityLevel}
                onChange={(event) => setSensitivityLevel(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              >
                <option value="standard">Standard</option>
                <option value="private">Private</option>
                <option value="restricted">Restricted</option>
                <option value="confidential">Confidential</option>
                <option value="taonga">Taonga</option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-medium text-stone-200">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              >
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
                <option value="under_review">Under review</option>
              </select>
            </label>
          </div>

          <div className="rounded-2xl border border-stone-800 bg-stone-950 p-5">
            <h2 className="text-sm font-semibold text-stone-100">
              Related records
            </h2>

            <p className="mt-1 text-sm text-stone-500">
              Optional links. Select one or more records this document relates
              to.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-200">
                  Related person
                </span>
                <select
                  value={relatedPersonId}
                  onChange={(event) => setRelatedPersonId(event.target.value)}
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

              <label className="grid gap-2">
                <span className="text-sm font-medium text-stone-200">
                  Related marae
                </span>
                <select
                  value={relatedMaraeId}
                  onChange={(event) => setRelatedMaraeId(event.target.value)}
                  className="rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
                  disabled={isLoadingRelations}
                >
                  <option value="">
                    {isLoadingRelations ? "Loading marae..." : "None"}
                  </option>

                  {maraeRecords.map((record) => (
                    <option key={record.id} value={record.id}>
                      {record.name}
                    </option>
                  ))}
                </select>
              </label>

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

              <label className="grid gap-2 md:col-span-2">
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
            </div>
          </div>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-stone-200">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-32 rounded-xl border border-stone-700 bg-stone-950 px-4 py-3 text-stone-100 outline-none focus:border-stone-500"
              placeholder="Describe the document, evidence, or reference."
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
              {isSubmitting ? "Saving..." : "Create Document Record"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/documents")}
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