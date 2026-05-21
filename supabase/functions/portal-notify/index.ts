// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

type NotifyPayload = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  clientName?: string;
  context?: Record<string, unknown>;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY manquante dans les secrets Supabase Functions." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = (await req.json()) as NotifyPayload;
    if (!payload?.to || !payload?.subject) {
      return new Response(
        JSON.stringify({ error: "Payload invalide. Champs requis : to, subject." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const toList = Array.isArray(payload.to) ? payload.to : [payload.to];
    const html = payload.html ?? defaultHtml(payload);
    const text = payload.text ?? defaultText(payload);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Lefevre Conseil <no-reply@lefevre-conseil.fr>",
        to: toList,
        subject: payload.subject,
        html,
        text,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({
          error: "Erreur envoi Resend",
          details: resendData,
        }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        provider: "resend",
        data: resendData,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: "Erreur inattendue portal-notify", details: error?.message ?? String(error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function defaultHtml(payload: NotifyPayload) {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#111827">
      <h2 style="margin:0 0 12px;font-size:18px">Lefevre Conseil - Notification portail</h2>
      <p style="margin:0 0 12px">${escapeHtml(payload.subject)}</p>
      ${
        payload.clientName
          ? `<p style="margin:0 0 12px"><strong>Client :</strong> ${escapeHtml(payload.clientName)}</p>`
          : ""
      }
      <p style="margin:0;color:#6b7280;font-size:13px">Message automatique envoyé depuis l'espace client/admin.</p>
    </div>
  `;
}

function defaultText(payload: NotifyPayload) {
  return `Lefevre Conseil - Notification portail\n\n${payload.subject}${
    payload.clientName ? `\nClient: ${payload.clientName}` : ""
  }\n\nMessage automatique envoyé depuis l'espace client/admin.`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

