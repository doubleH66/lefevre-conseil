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

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY")?.trim();
    if (!resendApiKey) {
      // Pas d'erreur 500 : les e-mails sont optionnels tant que Resend n'est pas configuré.
      return jsonResponse({
        ok: false,
        skipped: true,
        reason: "RESEND_API_KEY manquante. Définir le secret Supabase pour activer les e-mails.",
      });
    }

    const from =
      Deno.env.get("RESEND_FROM_EMAIL")?.trim() ||
      "Lefèvre Conseil <no-reply@lefevre-conseil.fr>";

    const payload = (await req.json()) as NotifyPayload;
    if (!payload?.subject?.trim()) {
      return jsonResponse({ error: "Payload invalide. Champ requis : subject." }, 400);
    }

    const toList = (Array.isArray(payload.to) ? payload.to : [payload.to])
      .map((e) => (typeof e === "string" ? e.trim() : ""))
      .filter(isValidEmail);

    if (toList.length === 0) {
      return jsonResponse({
        ok: false,
        skipped: true,
        reason: "Aucune adresse e-mail valide dans le champ to.",
      });
    }

    const html = payload.html ?? defaultHtml(payload);
    const text = payload.text ?? defaultText(payload);

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: toList,
        subject: payload.subject.trim(),
        html,
        text,
      }),
    });

    const resendData = await resendResponse.json();

    if (!resendResponse.ok) {
      return jsonResponse(
        {
          ok: false,
          error: "Erreur envoi Resend",
          details: resendData,
        },
        502,
      );
    }

    return jsonResponse({
      ok: true,
      provider: "resend",
      data: resendData,
    });
  } catch (error: any) {
    return jsonResponse(
      {
        ok: false,
        error: "Erreur inattendue portal-notify",
        details: error?.message ?? String(error),
      },
      500,
    );
  }
});

function defaultHtml(payload: NotifyPayload) {
  const body = payload.text?.trim()
    ? `<div style="margin:0 0 16px;white-space:pre-wrap">${escapeHtml(payload.text)}</div>`
    : `<p style="margin:0 0 12px">${escapeHtml(payload.subject)}</p>`;

  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.5;color:#111827;max-width:560px">
      <h2 style="margin:0 0 12px;font-size:18px;color:#1f2a7c">Lefèvre Conseil</h2>
      <p style="margin:0 0 12px;font-weight:600">${escapeHtml(payload.subject)}</p>
      ${
        payload.clientName
          ? `<p style="margin:0 0 12px"><strong>Client :</strong> ${escapeHtml(payload.clientName)}</p>`
          : ""
      }
      ${body}
      <p style="margin:16px 0 0;color:#6b7280;font-size:13px">Message automatique — Lefèvre Conseil</p>
    </div>
  `;
}

function defaultText(payload: NotifyPayload) {
  if (payload.text?.trim()) return payload.text.trim();
  return `Lefèvre Conseil\n\n${payload.subject}${
    payload.clientName ? `\nClient: ${payload.clientName}` : ""
  }`;
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
