import { CABINET_CONTACT, SITE_NAME } from "@/lib/content/site";

export type SiteLeadEmailContext = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  requestType: string;
  currentSituation?: string;
  patrimonialGoal?: string;
  approximateAmount?: string;
  message?: string;
  contactPreference?: string;
};

function escapeHtml(input: string): string {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function detailLines(ctx: SiteLeadEmailContext): string[] {
  const fullName = `${ctx.firstName} ${ctx.lastName}`.trim();
  return [
    `Contact : ${fullName}`,
    `E-mail : ${ctx.email}`,
    ctx.phone ? `Téléphone : ${ctx.phone}` : null,
    `Type : ${ctx.requestType}`,
    ctx.currentSituation ? `Situation : ${ctx.currentSituation}` : null,
    ctx.patrimonialGoal ? `Objectif : ${ctx.patrimonialGoal}` : null,
    ctx.approximateAmount ? `Montant approx. : ${ctx.approximateAmount}` : null,
    ctx.message ? `Message :\n${ctx.message}` : null,
    ctx.contactPreference ? `Préférence contact : ${ctx.contactPreference}` : null,
  ].filter((line): line is string => Boolean(line));
}

function detailHtmlRows(ctx: SiteLeadEmailContext): string {
  return detailLines(ctx)
    .map((line) => {
      const [label, ...rest] = line.split(" : ");
      const value = rest.join(" : ");
      return `<tr><td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap">${escapeHtml(label ?? line)}</td><td style="padding:6px 0;color:#111827;vertical-align:top">${escapeHtml(value || line).replaceAll("\n", "<br/>")}</td></tr>`;
    })
    .join("");
}

function emailShell(title: string, bodyHtml: string, footer: string): string {
  return `
    <div style="font-family:Inter,Arial,sans-serif;line-height:1.55;color:#111827;max-width:560px">
      <p style="margin:0 0 4px;font-size:12px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;color:#1f2a7c">${escapeHtml(SITE_NAME)}</p>
      <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#1f2a7c">${escapeHtml(title)}</h1>
      ${bodyHtml}
      <p style="margin:24px 0 0;color:#6b7280;font-size:13px">${escapeHtml(footer)}</p>
    </div>
  `;
}

export function buildAdminLeadEmail(ctx: SiteLeadEmailContext) {
  const fullName = `${ctx.firstName} ${ctx.lastName}`.trim();
  const text = [
    "Nouvelle demande reçue via le formulaire du site.",
    "",
    ...detailLines(ctx),
    "",
    "Voir : /espace-admin/demandes",
  ].join("\n");

  const html = emailShell(
    "Nouvelle demande de rendez-vous",
    `<p style="margin:0 0 16px">Une nouvelle demande vient d'être enregistrée sur le site.</p>
     <table style="border-collapse:collapse;width:100%">${detailHtmlRows(ctx)}</table>
     <p style="margin:16px 0 0"><strong>Client :</strong> ${escapeHtml(fullName)}</p>`,
    "Notification automatique — espace admin Lefèvre Conseil",
  );

  return {
    subject: `[Site] Nouvelle demande de rendez-vous — ${fullName}`,
    text,
    html,
    clientName: fullName,
  };
}

export function buildVisitorLeadConfirmationEmail(ctx: SiteLeadEmailContext) {
  const text = [
    `Bonjour ${ctx.firstName},`,
    "",
    `Nous avons bien reçu votre demande de rendez-vous (${ctx.requestType}).`,
    "Un conseiller du cabinet Lefèvre Conseil vous recontactera rapidement pour convenir d'un créneau.",
    "",
    `Téléphone : ${CABINET_CONTACT.phone}`,
    `E-mail : ${CABINET_CONTACT.email}`,
    "",
    "Cordialement,",
    SITE_NAME,
  ].join("\n");

  const html = emailShell(
    "Demande de rendez-vous bien reçue",
    `<p style="margin:0 0 12px">Bonjour ${escapeHtml(ctx.firstName)},</p>
     <p style="margin:0 0 12px">Nous avons bien reçu votre demande de rendez-vous (<strong>${escapeHtml(ctx.requestType)}</strong>).</p>
     <p style="margin:0 0 12px">Un conseiller du cabinet vous recontactera rapidement pour convenir d'un créneau, par téléphone, e-mail ou visioconférence selon votre préférence.</p>
     <p style="margin:0"><strong>Téléphone :</strong> ${escapeHtml(CABINET_CONTACT.phone)}<br/>
     <strong>E-mail :</strong> ${escapeHtml(CABINET_CONTACT.email)}</p>`,
    "Merci pour votre confiance.",
  );

  return {
    subject: "Confirmation de votre demande de rendez-vous — Lefèvre Conseil",
    text,
    html,
    clientName: ctx.firstName,
  };
}
