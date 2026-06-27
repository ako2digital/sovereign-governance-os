import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import { supabase } from "@/lib/supabaseClient";

type OrgProfile = {
  id: string;
  organisation_name: string;
  legal_name: string | null;
  trading_name: string | null;
  organisation_type: string | null;
  legal_structure: string | null;
  registration_number: string | null;
  charity_number: string | null;
  rohe: string | null;
  region: string | null;
  primary_marae: string | null;
  hapu_affiliation: string | null;
  iwi_affiliation: string | null;
  kaupapa: string | null;
  mission_statement: string | null;
  operating_summary: string | null;
  governance_summary: string | null;
  primary_contact_name: string | null;
  primary_contact_email: string | null;
  primary_contact_phone: string | null;
  website: string | null;
  postal_address: string | null;
  status: string | null;
  data_sensitivity_default: string | null;
  funding_priorities: string | null;
  reporting_priorities: string | null;
  outcome_priorities: string | null;
  notes: string | null;
  created_at: string | null;
  updated_at: string | null;
};

const orgTypeLabels: Record<string, string> = {
  hapu: "Hapū",
  marae_trust: "Marae Trust",
  maori_trust: "Māori Trust",
  charitable_trust: "Charitable Trust",
  iwi_organisation: "Iwi Organisation",
  maori_business: "Māori Business",
  community_organisation: "Community Organisation",
  service_provider: "Service Provider",
  other: "Other",
};

function val(v: string | null | undefined) {
  return v || "—";
}

function OrgTypeTag({ type }: { type: string | null }) {
  if (!type) return null;
  return (
    <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted-foreground)]">
      {orgTypeLabels[type] ?? type}
    </span>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[var(--border)] pt-6 first:border-t-0 first:pt-0">
      <p className="mb-4 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-4">
      <p className="w-48 shrink-0 text-xs text-[var(--muted-foreground)]">{label}</p>
      <p className="text-sm text-[var(--foreground)]">{val(value)}</p>
    </div>
  );
}

export default async function OrganisationPage() {
  const { data, error } = await supabase
    .from("organisation_profiles")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  const profile = data as OrgProfile | null;

  if (error) {
    return (
      <AppShell title="Organisation Profile" eyebrow="Overview">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold text-red-400">Database error</h1>
          <pre className="mt-4 whitespace-pre-wrap text-sm text-red-400">{error.message}</pre>
        </section>
      </AppShell>
    );
  }

  if (!profile) {
    return (
      <AppShell title="Organisation Profile" eyebrow="Overview">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
            Organisation Profile
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
            The organisation profile is the hapū-held source of truth that anchors everything in Tangata.
            It defines who owns this data, what type of organisation holds it, what kaupapa it serves,
            how governance works, what mandate processes are used, what information is managed,
            who the organisation reports to, what external relationships matter, and what outcomes it is working toward.
            Every record, hui, decision, document, report, and outcome belongs to this organisation.
          </p>
        </section>

        <section className="mt-6 rounded-2xl border border-[var(--accent)]/30 bg-[var(--surface)] p-8">
          <p className="text-sm font-semibold text-[var(--foreground)]">
            No organisation profile set up yet
          </p>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Set up the organisation profile first. This is the foundation that anchors all governance,
            reporting, funding readiness, and outcome records in Tangata.
          </p>
          <div className="mt-6">
            <Link
              href="/organisation/new"
              className="rounded-xl bg-[var(--foreground)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:opacity-90"
            >
              Set Up Organisation Profile
            </Link>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
            What the organisation profile anchors
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Data Sovereignty", desc: "The organisation decides what is shared, who it is shared with, why, and for what purpose. External access is always controlled, permissioned, and purpose-based." },
              { label: "Governance Chain", desc: "Hui, minutes, decisions, and tasks belong to this organisation — proving the process and showing the mandate." },
              { label: "People & Roles", desc: "Staff, trustees, members, and kaumātua are linked here — proving who participated and what authority they held." },
              { label: "Hapū / Marae / Whenua", desc: "Land, marae, and hapū affiliations are defined in the profile — the geographic and cultural basis for mandate." },
              { label: "Library & Evidence", desc: "Documents, files, and evidence carry the organisation's context — supporting controlled sharing and negotiation." },
              { label: "Reports & Outcomes", desc: "All reports are generated for and on behalf of this organisation — and reported back to the people who the data belongs to." },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface-raised)] p-4"
              >
                <p className="text-sm font-semibold text-[var(--foreground)]">{item.label}</p>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell title="Organisation Profile" eyebrow="Overview">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-raised)] p-8">
        <div className="absolute inset-x-0 top-0 h-[3px] bg-[var(--accent)]" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[var(--foreground)]">
              {profile.organisation_name}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <OrgTypeTag type={profile.organisation_type} />
              {profile.status && (
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                  {profile.status}
                </span>
              )}
              {profile.rohe && (
                <span className="text-xs text-[var(--muted-foreground)]">
                  {profile.rohe}
                </span>
              )}
            </div>
            {profile.kaupapa && (
              <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--muted-foreground)]">
                {profile.kaupapa}
              </p>
            )}
          </div>
          <Link
            href="/organisation/edit"
            className="shrink-0 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
          >
            Edit Profile
          </Link>
        </div>
      </section>

      {/* Profile Detail */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <div className="space-y-6">

          {/* Identity */}
          <Section title="Organisation Identity">
            <div className="space-y-3">
              <Row label="Organisation Name" value={profile.organisation_name} />
              <Row label="Legal Name" value={profile.legal_name} />
              <Row label="Trading Name" value={profile.trading_name} />
              <Row label="Organisation Type" value={profile.organisation_type ? (orgTypeLabels[profile.organisation_type] ?? profile.organisation_type) : null} />
              <Row label="Legal Structure" value={profile.legal_structure} />
              <Row label="Registration Number" value={profile.registration_number} />
              <Row label="Charity Number" value={profile.charity_number} />
              <Row label="Status" value={profile.status} />
            </div>
          </Section>

          {/* Location / Affiliation */}
          <Section title="Rohe, Hapū, Marae & Iwi">
            <div className="space-y-3">
              <Row label="Rohe" value={profile.rohe} />
              <Row label="Region" value={profile.region} />
              <Row label="Primary Marae" value={profile.primary_marae} />
              <Row label="Hapū Affiliation" value={profile.hapu_affiliation} />
              <Row label="Iwi Affiliation" value={profile.iwi_affiliation} />
            </div>
          </Section>

          {/* Kaupapa / Mission */}
          <Section title="Kaupapa & Mission">
            <div className="space-y-3">
              {profile.kaupapa && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Kaupapa</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.kaupapa}</p>
                </div>
              )}
              {profile.mission_statement && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Mission Statement</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.mission_statement}</p>
                </div>
              )}
              {profile.operating_summary && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Operating Summary</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.operating_summary}</p>
                </div>
              )}
              {profile.governance_summary && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Governance Summary</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.governance_summary}</p>
                </div>
              )}
              {!profile.kaupapa && !profile.mission_statement && !profile.operating_summary && !profile.governance_summary && (
                <p className="text-sm text-[var(--muted-foreground)]">—</p>
              )}
            </div>
          </Section>

          {/* Priorities */}
          <Section title="Funding, Reporting & Outcome Priorities">
            <div className="space-y-3">
              {profile.funding_priorities && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Funding Priorities</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.funding_priorities}</p>
                </div>
              )}
              {profile.reporting_priorities && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Reporting Priorities</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.reporting_priorities}</p>
                </div>
              )}
              {profile.outcome_priorities && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Outcome Priorities</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.outcome_priorities}</p>
                </div>
              )}
              {!profile.funding_priorities && !profile.reporting_priorities && !profile.outcome_priorities && (
                <p className="text-sm text-[var(--muted-foreground)]">—</p>
              )}
            </div>
          </Section>

          {/* Contact */}
          <Section title="Contact Details">
            <div className="space-y-3">
              <Row label="Primary Contact" value={profile.primary_contact_name} />
              <Row label="Email" value={profile.primary_contact_email} />
              <Row label="Phone" value={profile.primary_contact_phone} />
              <Row label="Website" value={profile.website} />
              <Row label="Postal Address" value={profile.postal_address} />
            </div>
          </Section>

          {/* Data / settings */}
          <Section title="Data Settings">
            <div className="space-y-3">
              <Row label="Data Sensitivity Default" value={profile.data_sensitivity_default} />
              {profile.notes && (
                <div>
                  <p className="text-xs text-[var(--muted-foreground)]">Notes</p>
                  <p className="mt-1 text-sm text-[var(--foreground)]">{profile.notes}</p>
                </div>
              )}
            </div>
          </Section>

        </div>
      </section>

      {/* System connections */}
      <section className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
          Core system
        </p>
        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
          All records in Tangata operate within the context of this organisation profile.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: "People", href: "/people" },
            { label: "Governance Chain", href: "/hui" },
            { label: "Library & Evidence", href: "/library" },
            { label: "Reports", href: "/reports" },
            { label: "Funding Readiness", href: "/reports/funding-readiness" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
