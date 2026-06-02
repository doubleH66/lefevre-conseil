import { createClient } from "@supabase/supabase-js";
import { getAlptisConfig, isAlptisApiEnabled } from "@/lib/partners/alptis/config";
import {
  buildSanteSelectTarificationPayload,
  summarizeTarificationResponse,
} from "@/lib/partners/alptis/mapper";
import { redactPayload } from "@/lib/partners/alptis/redact";
import type { MutuelleSubmitInput } from "@/lib/mutuelle/schema";
import { requireSupabasePublicEnv } from "@/lib/supabase/public-env";

const TARIFICATION_PATH =
  "/partenaires/sante-select/api/tarification/tarifer-niveaux-entiers";

export type AlptisTarificationOutcome = {
  enabled: boolean;
  called: boolean;
  status: "success" | "error" | "disabled";
  errorMessage?: string;
  summaryLines?: string[];
  responseStatus?: number;
};

async function logPartnerCall(input: {
  leadId: string;
  endpoint: string;
  requestRedacted: unknown;
  responseStatus: number | null;
  responseRedacted: unknown;
  success: boolean;
  errorMessage?: string;
  durationMs: number;
}) {
  const { url, anonKey } = requireSupabasePublicEnv();
  const supabase = createClient(url, anonKey);
  await supabase.rpc("log_partner_api_call", {
    p_lead_id: input.leadId,
    p_partner: "alptis",
    p_endpoint: input.endpoint,
    p_request_payload_redacted: input.requestRedacted,
    p_response_status: input.responseStatus,
    p_response_payload_redacted: input.responseRedacted,
    p_success: input.success,
    p_error_message: input.errorMessage ?? null,
    p_duration_ms: input.durationMs,
  });
}

export async function runAlptisTarificationIfEnabled(
  leadId: string,
  data: MutuelleSubmitInput,
): Promise<AlptisTarificationOutcome> {
  if (!isAlptisApiEnabled()) {
    return { enabled: false, called: false, status: "disabled" };
  }

  const config = getAlptisConfig();
  if (!config) {
    return {
      enabled: true,
      called: false,
      status: "disabled",
      errorMessage: "Configuration Alptis incomplète",
    };
  }

  const endpoint = `${config.baseUrl}${TARIFICATION_PATH}`;
  const requestBody = buildSanteSelectTarificationPayload(data, config.codeDistributeur);
  const requestRedacted = redactPayload(requestBody);
  const started = Date.now();

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Alptis-Api-Key": config.apiKey,
      },
      body: JSON.stringify(requestBody),
    });

    const durationMs = Date.now() - started;
    let parsed: unknown = null;
    const text = await res.text();
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = { raw: text.slice(0, 500) };
    }

    const responseRedacted = redactPayload(parsed);

    if (!res.ok) {
      const errorMessage = `HTTP ${res.status}`;
      await logPartnerCall({
        leadId,
        endpoint: TARIFICATION_PATH,
        requestRedacted,
        responseStatus: res.status,
        responseRedacted,
        success: false,
        errorMessage,
        durationMs,
      });
      return {
        enabled: true,
        called: true,
        status: "error",
        errorMessage,
        responseStatus: res.status,
      };
    }

    await logPartnerCall({
      leadId,
      endpoint: TARIFICATION_PATH,
      requestRedacted,
      responseStatus: res.status,
      responseRedacted,
      success: true,
      durationMs,
    });

    return {
      enabled: true,
      called: true,
      status: "success",
      summaryLines: summarizeTarificationResponse(parsed),
      responseStatus: res.status,
    };
  } catch (e) {
    const durationMs = Date.now() - started;
    const errorMessage = e instanceof Error ? e.message : "Erreur réseau";
    await logPartnerCall({
      leadId,
      endpoint: TARIFICATION_PATH,
      requestRedacted,
      responseStatus: null,
      responseRedacted: null,
      success: false,
      errorMessage,
      durationMs,
    });
    return {
      enabled: true,
      called: true,
      status: "error",
      errorMessage,
    };
  }
}
