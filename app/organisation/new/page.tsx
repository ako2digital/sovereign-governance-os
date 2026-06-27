import { redirect } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

async function createOrganisationProfile(formData: FormData) {
  "use server";

  const orgName = String(formData.get("organisation_name") || "").trim();
  if (!orgName) return;

  const { error } = await supabase.from("organisation_profiles").insert({
    organisation_name: orgName,
    legal_name: String(formData.get("legal_name") || "").trim() || null,
    trading_name: String(formData.get("trading_name") || "").trim() || null,
    organisation_type: String(formData.get("organisation_type") || "").trim() || null,
    legal_structure: String(formData.get("legal_structure") || "").trim() || null,
    registration_number: String(formData.get("registration_number") || "").trim() || null,
    charity_number: String(formData.get("charity_number") || "").trim() || null,
    rohe: String(formData.get("rohe") || "").trim() || null,
    region: String(formData.get("region") || "").trim() || null,
    primary_marae: String(formData.get("primary_marae") || "").trim() || null,
    hapu_affiliation: String(formData.get("hapu_affiliation") || "").trim() || null,
    iwi_affiliation: String(formData.get("iwi_affiliation") || "").trim() || null,
    kaupapa: String(formData.get("kaupapa") || "").trim() || null,
    mission_statement: String(formData.get("mission_statement") || "").trim() || null,
    operating_summary: String(formData.get("operating_summary") || "").trim() || null,
    governance_summary: String(formData.get("governance_summary") || "").trim() || null,
    primary_contact_name: String(formData.get("primary_contact_name") || "").trim() || null,
    primary_contact_email: String(formData.get("primary_contact_email") || "").trim() || null,
    primary_contact_phone: String(formData.get("primary_contact_phone") || "").trim() || null,
    website: String(formData.get("website") || "").trim() || null,
    postal_address: String(formData.get("postal_address") || "").trim() || null,
    status: String(formData.get("status") || "active").trim() || "active",
    data_sensitivity_default: String(formData.get("data_sensitivity_default") || "standard").trim() || "standard",
    funding_priorities: String(formData.get("funding_priorities") || "").trim() || null,
    reporting_priorities: String(formData.get("reporting_priorities") || "").trim() || null,
    outcome_priorities: String(formData.get("outcome_priorities") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/organisation");
}

const inputClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]";

const selectClass =
  "mt-2 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]";

const labelClass = "block text-sm font-medium text-[var(--foreground)]";

const groupHeadingClass =
  "text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]";

export default async function NewOrganisationPage() {
  // If a profile already exists, redirect to edit instead
  const { data } = await supabase
    .from("organisation_profiles")
    .select("id")
    .limit(1)
    .maybeSingle();

  if (data) {
    redirect("/organisation/edit");
  }

  return (
    <AppShell title="Set Up Organisation Profile" eyebrow="Overview">
      <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
          Overview
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
          Set Up Organisation Profile
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
          The organisation profile is the hapū-held source of truth that anchors everything in Tangata.
          It defines who owns this data, what type of organisation holds it, what kaupapa it serves,
          and what mandate, relationships, and outcomes matter.
          Governance, people, evidence, reports, and outcomes all belong to this organisation.
          Only organisation name is required. All other fields can be filled in later.
        </p>
      </section>

      <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Organisation Details</h2>
          <Link
            href="/organisation"
            className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Cancel
          </Link>
        </div>

        <form action={createOrganisationProfile} className="mt-6 space-y-8">

          {/* 1. Identity */}
          <div>
            <h3 className={groupHeadingClass}>Identity</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div className="md:col-span-2">
                <label htmlFor="organisation_name" className={labelClass}>
                  Organisation Name{" "}
                  <span className="text-[var(--accent)]" aria-hidden="true">*</span>
                </label>
                <input
                  id="organisation_name"
                  name="organisation_name"
                  type="text"
                  required
                  placeholder="The primary name of this organisation"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="legal_name" className={labelClass}>Legal Name</label>
                <input
                  id="legal_name"
                  name="legal_name"
                  type="text"
                  placeholder="Registered legal name"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="trading_name" className={labelClass}>Trading Name</label>
                <input
                  id="trading_name"
                  name="trading_name"
                  type="text"
                  placeholder="Name used in day-to-day operations"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 2. Organisation type / legal structure */}
          <div>
            <h3 className={groupHeadingClass}>Organisation Type & Legal Structure</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="organisation_type" className={labelClass}>Organisation Type</label>
                <select
                  id="organisation_type"
                  name="organisation_type"
                  defaultValue=""
                  className={selectClass}
                >
                  <option value="">Select type</option>
                  <option value="hapu">Hapū</option>
                  <option value="marae_trust">Marae Trust</option>
                  <option value="maori_trust">Māori Trust</option>
                  <option value="charitable_trust">Charitable Trust</option>
                  <option value="iwi_organisation">Iwi Organisation</option>
                  <option value="maori_business">Māori Business</option>
                  <option value="community_organisation">Community Organisation</option>
                  <option value="service_provider">Service Provider</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="legal_structure" className={labelClass}>Legal Structure</label>
                <input
                  id="legal_structure"
                  name="legal_structure"
                  type="text"
                  placeholder="e.g. Incorporated Society, Trust, Company"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="registration_number" className={labelClass}>Registration Number</label>
                <input
                  id="registration_number"
                  name="registration_number"
                  type="text"
                  placeholder="Companies Office or Charities Services number"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="charity_number" className={labelClass}>Charity Number</label>
                <input
                  id="charity_number"
                  name="charity_number"
                  type="text"
                  placeholder="Charities Services registration number"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="status" className={labelClass}>Status</label>
                <select
                  id="status"
                  name="status"
                  defaultValue="active"
                  className={selectClass}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Location / rohe / affiliations */}
          <div>
            <h3 className={groupHeadingClass}>Location, Rohe & Affiliations</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="rohe" className={labelClass}>Rohe</label>
                <input
                  id="rohe"
                  name="rohe"
                  type="text"
                  placeholder="Tribal rohe or territorial area"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="region" className={labelClass}>Region</label>
                <input
                  id="region"
                  name="region"
                  type="text"
                  placeholder="e.g. Northland, Bay of Plenty"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="primary_marae" className={labelClass}>Primary Marae</label>
                <input
                  id="primary_marae"
                  name="primary_marae"
                  type="text"
                  placeholder="Main marae associated with this organisation"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="hapu_affiliation" className={labelClass}>Hapū Affiliation</label>
                <input
                  id="hapu_affiliation"
                  name="hapu_affiliation"
                  type="text"
                  placeholder="Hapū name(s)"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="iwi_affiliation" className={labelClass}>Iwi Affiliation</label>
                <input
                  id="iwi_affiliation"
                  name="iwi_affiliation"
                  type="text"
                  placeholder="Iwi name(s)"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 4. Kaupapa / mission */}
          <div>
            <h3 className={groupHeadingClass}>Kaupapa & Mission</h3>
            <div className="mt-4 grid gap-5">
              <div>
                <label htmlFor="kaupapa" className={labelClass}>Kaupapa</label>
                <textarea
                  id="kaupapa"
                  name="kaupapa"
                  rows={2}
                  placeholder="The core purpose and values of this organisation"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="mission_statement" className={labelClass}>Mission Statement</label>
                <textarea
                  id="mission_statement"
                  name="mission_statement"
                  rows={2}
                  placeholder="Formal mission statement"
                  className={inputClass}
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label htmlFor="operating_summary" className={labelClass}>Operating Summary</label>
                  <textarea
                    id="operating_summary"
                    name="operating_summary"
                    rows={3}
                    placeholder="What this organisation does day-to-day"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="governance_summary" className={labelClass}>Governance Summary</label>
                  <textarea
                    id="governance_summary"
                    name="governance_summary"
                    rows={3}
                    placeholder="How this organisation is governed — trustees, committees, AGM structure"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Priorities */}
          <div>
            <h3 className={groupHeadingClass}>Funding, Reporting & Outcome Priorities</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-3">
              <div>
                <label htmlFor="funding_priorities" className={labelClass}>Funding Priorities</label>
                <textarea
                  id="funding_priorities"
                  name="funding_priorities"
                  rows={3}
                  placeholder="Key funding areas or current applications"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="reporting_priorities" className={labelClass}>Reporting Priorities</label>
                <textarea
                  id="reporting_priorities"
                  name="reporting_priorities"
                  rows={3}
                  placeholder="What this organisation needs to report on and to whom"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="outcome_priorities" className={labelClass}>Outcome Priorities</label>
                <textarea
                  id="outcome_priorities"
                  name="outcome_priorities"
                  rows={3}
                  placeholder="What outcomes this organisation is working toward"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 6. Contact details */}
          <div>
            <h3 className={groupHeadingClass}>Contact Details</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="primary_contact_name" className={labelClass}>Primary Contact Name</label>
                <input
                  id="primary_contact_name"
                  name="primary_contact_name"
                  type="text"
                  placeholder="Name of primary contact person"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="primary_contact_email" className={labelClass}>Email</label>
                <input
                  id="primary_contact_email"
                  name="primary_contact_email"
                  type="email"
                  placeholder="contact@organisation.nz"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="primary_contact_phone" className={labelClass}>Phone</label>
                <input
                  id="primary_contact_phone"
                  name="primary_contact_phone"
                  type="tel"
                  placeholder="Phone number"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="website" className={labelClass}>Website</label>
                <input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://example.nz"
                  className={inputClass}
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="postal_address" className={labelClass}>Postal Address</label>
                <input
                  id="postal_address"
                  name="postal_address"
                  type="text"
                  placeholder="Postal address"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* 7. Data settings / notes */}
          <div>
            <h3 className={groupHeadingClass}>Data Settings & Notes</h3>
            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label htmlFor="data_sensitivity_default" className={labelClass}>
                  Default Data Sensitivity
                </label>
                <select
                  id="data_sensitivity_default"
                  name="data_sensitivity_default"
                  defaultValue="standard"
                  className={selectClass}
                >
                  <option value="public">Public</option>
                  <option value="standard">Standard</option>
                  <option value="sensitive">Sensitive</option>
                  <option value="restricted">Restricted</option>
                </select>
              </div>
              <div>
                <label htmlFor="notes" className={labelClass}>Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  placeholder="Additional context or notes"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-6">
            <button
              type="submit"
              className="rounded-xl bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Create Organisation Profile
            </button>
            <Link
              href="/organisation"
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
