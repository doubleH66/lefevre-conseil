import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { SITE_ADMIN_NOTIFY_EMAIL } from "@/lib/content/site";
import {
  buildAdminLeadEmail,
  buildVisitorLeadConfirmationEmail,
} from "@/lib/site-lead/email-templates";
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
  html?: string;
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
  const body = await res.text();
  if (!res.ok) {
    console.warn("portal-notify site-lead HTTP:", res.status, body);
    return false;
  }
  try {
    const data = JSON.parse(body) as { ok?: boolean; skipped?: boolean; error?: string };
    if (!data.ok && !data.skipped) {
      console.warn("portal-notify site-lead:", body);
      return false;
    }
  } catch {
    console.warn("portal-notify site-lead parse:", body);
    return false;
  }
  return true;
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

    const adminEmail =
      process.env.CABINET_NOTIFY_EMAIL?.trim() ||
      process.env.PHILIPPE_NOTIFICATION_EMAIL?.trim() ||
      SITE_ADMIN_NOTIFY_EMAIL;
    const requestType = body.requestType?.trim() || "Prise de rendez-vous";
    const emailCtx = {
      firstName,
      lastName,
      email,
      phone: body.phone?.trim(),
      requestType,
      currentSituation: body.currentSituation?.trim(),
      patrimonialGoal: body.patrimonialGoal?.trim(),
      approximateAmount: body.approximateAmount?.trim(),
      message: body.message?.trim(),
      contactPreference: body.contactPreference ?? "either",
    };

    const adminMail = buildAdminLeadEmail(emailCtx);
    const visitorMail = buildVisitorLeadConfirmationEmail(emailCtx);

    await Promise.all([
      invokePortalNotify({
        to: adminEmail,
        subject: adminMail.subject,
        text: adminMail.text,
        html: adminMail.html,
        clientName: adminMail.clientName,
      }),
      invokePortalNotify({
        to: email,
        subject: visitorMail.subject,
        text: visitorMail.text,
        html: visitorMail.html,
        clientName: visitorMail.clientName,
      }),
    ]);

    return NextResponse.json({ ok: true, id: leadId });
  } catch (e) {
    console.error("site-lead API:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
