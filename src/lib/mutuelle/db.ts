import { createClient } from "@supabase/supabase-js";
import type { MutuelleDraftInput, MutuelleSubmitInput } from "@/lib/mutuelle/schema";
import { requireSupabasePublicEnv } from "@/lib/supabase/public-env";

function supabaseAnon() {
  const { url, anonKey } = requireSupabasePublicEnv();
  return createClient(url, anonKey);
}

export async function saveMutuelleDraft(input: MutuelleDraftInput): Promise<{ id: string } | { error: string }> {
  const supabase = supabaseAnon();
  const { data, error } = await supabase.rpc("save_mutuelle_lead_draft", {
    p_lead_id: input.leadId ?? null,
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_email: input.email,
    p_phone: input.phone,
    p_postal_code: input.postalCode,
    p_birth_date: input.birthDate,
    p_profile_type: input.profileType ?? null,
    p_source_page: input.sourcePage ?? null,
    p_honeypot: input.website ?? null,
  });

  if (error) return { error: error.message };
  return { id: data as string };
}

export async function submitMutuelleLead(
  input: MutuelleSubmitInput,
  apiMeta: {
    apiEnabled: boolean;
    apiPartner: string | null;
    apiStatus: string | null;
    apiError: string | null;
    apiResponseSummary: Record<string, unknown> | null;
  },
): Promise<{ id: string } | { error: string }> {
  const supabase = supabaseAnon();
  const { data, error } = await supabase.rpc("submit_mutuelle_lead", {
    p_lead_id: input.leadId ?? null,
    p_first_name: input.firstName,
    p_last_name: input.lastName,
    p_email: input.email,
    p_phone: input.phone,
    p_postal_code: input.postalCode,
    p_birth_date: input.birthDate,
    p_profile_type: input.profileType,
    p_professional_status: input.professionalStatus,
    p_has_current_mutuelle: input.hasCurrentMutuelle,
    p_desired_change_date: input.desiredChangeDate,
    p_coverage_level: input.coverageLevel,
    p_health_priorities: input.healthPriorities,
    p_monthly_budget_range: input.monthlyBudgetRange,
    p_spouse_birth_date: input.spouseBirthDate ?? null,
    p_spouse_has_coverage: input.spouseHasCoverage ?? null,
    p_children_count: input.childrenCount ?? 0,
    p_children_birth_dates: input.childrenBirthDates ?? [],
    p_tns_activity_type: input.tnsActivityType ?? null,
    p_madelin_interest: input.madelinInterest ?? null,
    p_senior_is_retired: input.seniorIsRetired ?? null,
    p_senior_priority_notes: input.seniorPriorityNotes ?? null,
    p_rgpd_consent: true,
    p_source_page: input.sourcePage ?? null,
    p_api_enabled: apiMeta.apiEnabled,
    p_api_partner: apiMeta.apiPartner,
    p_api_status: apiMeta.apiStatus,
    p_api_error: apiMeta.apiError,
    p_api_response_summary: apiMeta.apiResponseSummary,
    p_honeypot: input.website ?? null,
  });

  if (error) return { error: error.message };
  return { id: data as string };
}
