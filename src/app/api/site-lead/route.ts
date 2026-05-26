import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { CABINET_CONTACT } from "@/lib/content/site";
import { requireSupabasePublicEnv } from "@/lib/supabase/public-env";

export const runtime = "nodejs";

type SiteLeadBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  currentSituation?: string;
  requestType?: string;
  patrimonialGoal?: string;
  approximateAmount?: string;
  message?: string;
  contactPreference?: "email" | "phone" | "either";
  gdprConsent?: boolean;
  website?: string;
};

async function invokePortalNotify(payload: {
  to: string | string[];
  subject: string;
  text: string;
  clientName?: string;
}) {
  const { url, anonKey } = requireSupabasePublicEnv();
  const res = await fetch(`${url}/functions/v1/portal-notify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.warn("portal-notify site-lead:", await res.text());
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SiteLeadBody;

    if (body.website?.trim()) {
      return NextResponse.json({ ok: true });
    }

    const { url, anonKey } = requireSupabasePublicEnv();
    const supabase = createClient(url, anonKey);

    const firstName = body.firstName?.trim() ?? "";
    const lastName = body.lastName?.trim() ?? "";
    const email = body.email?.trim() ?? "";

    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "Prénom, nom et e-mail requis." }, { status: 400 });
    }

    if (!body.gdprConsent) {
      return NextResponse.json({ error: "Consentement RGPD requis." }, { status: 400 });
    }

    const { data: leadId, error } = await supabase.rpc("submit_site_lead", {
      p_first_name: firstName,
      p_last_name: lastName,
      p_email: email,
      p_phone: body.phone?.trim() || null,
      p_current_situation: body.currentSituation?.trim() || null,
      p_request_type: body.requestType?.trim() || null,
      p_patrimonial_goal: body.patrimonialGoal?.trim() || null,
      p_approximate_amount: body.approximateAmount?.trim() || null,
      p_message: body.message?.trim() || null,
      p_contact_preference: body.contactPreference ?? "either",
      p_gdpr_consent: true,
      p_honeypot: body.website ?? null,
    });

    if (error) {
      console.warn("submit_site_lead:", error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const cabinetEmail = process.env.CABINET_NOTIFY_EMAIL?.trim() || CABINET_CONTACT.email;
    const fullName = `${firstName} ${lastName}`;
    const requestType = body.requestType?.trim() || "Demande générale";

    const detailLines = [
      `Contact : ${fullName}`,
      `E-mail : ${email}`,
      body.phone ? `Téléphone : ${body.phone}` : null,
      `Type : ${requestType}`,
      body.currentSituation ? `Situation : ${body.currentSituation}` : null,
      body.patrimonialGoal ? `Objectif : ${body.patrimonialGoal}` : null,
      body.approximateAmount ? `Montant approx. : ${body.approximateAmount}` : null,
      body.message ? `Message :\n${body.message}` : null,
      `Préférence contact : ${body.contactPreference ?? "either"}`,
    ]
      .filter(Boolean)
      .join("\n");

    await Promise.all([
      invokePortalNotify({
        to: cabinetEmail,
        subject: `[Site] Nouvelle demande — ${fullName}`,
        clientName: fullName,
        text: `Nouvelle demande reçue via le formulaire du site.\n\n${detailLines}\n\nVoir : /espace-admin/demandes`,
      }),
      invokePortalNotify({
        to: email,
        subject: "Votre demande a bien été reçue — Lefèvre Conseil",
        clientName: firstName,
        text:
          `Bonjour ${firstName},\n\n` +
          `Nous avons bien reçu votre demande (${requestType}). ` +
          `Un conseiller du cabinet Lefèvre Conseil revient vers vous rapidement.\n\n` +
          `Cordialement,\nLefèvre Conseil\n04 68 86 36 22`,
      }),
    ]);

    return NextResponse.json({ ok: true, id: leadId });
  } catch (e) {
    console.error("site-lead API:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
