import { NextResponse } from "next/server";
import { CABINET_CONTACT } from "@/lib/content/site";
import { saveMutuelleDraft, submitMutuelleLead } from "@/lib/mutuelle/db";
import { buildMutuelleLeadEmailText } from "@/lib/mutuelle/format-email";
import { sendMutuelleNotification } from "@/lib/mutuelle/notify";
import { clientIpFromRequest, checkRateLimit } from "@/lib/mutuelle/rate-limit";
import { mutuelleSubmitSchema } from "@/lib/mutuelle/schema";
import { runAlptisTarificationIfEnabled } from "@/lib/partners/alptis/client";
import { isAlptisApiEnabled } from "@/lib/partners/alptis/config";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    if (!checkRateLimit(`mutuelle-submit:${ip}`).allowed) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const body: unknown = await request.json();
    const parsed = mutuelleSubmitSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Données invalides";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (parsed.data.website?.trim()) {
      return NextResponse.json({ ok: true });
    }

    let leadId = parsed.data.leadId;

    if (!leadId) {
      const draft = await saveMutuelleDraft({
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: parsed.data.email,
        phone: parsed.data.phone,
        postalCode: parsed.data.postalCode,
        birthDate: parsed.data.birthDate,
        profileType: parsed.data.profileType,
        sourcePage: parsed.data.sourcePage,
      });
      if ("error" in draft) {
        return NextResponse.json({ error: draft.error }, { status: 400 });
      }
      leadId = draft.id;
    }

    const alptis = await runAlptisTarificationIfEnabled(leadId, parsed.data);

    const submitResult = await submitMutuelleLead(
      { ...parsed.data, leadId },
      {
        apiEnabled: isAlptisApiEnabled(),
        apiPartner: isAlptisApiEnabled() ? "alptis" : null,
        apiStatus: alptis.status,
        apiError: alptis.errorMessage ?? null,
        apiResponseSummary: alptis.summaryLines
          ? { lines: alptis.summaryLines, statusCode: alptis.responseStatus ?? null }
          : null,
      },
    );

    if ("error" in submitResult) {
      return NextResponse.json({ error: submitResult.error }, { status: 400 });
    }

    const cabinetEmail =
      process.env.PHILIPPE_NOTIFICATION_EMAIL?.trim() ||
      process.env.CABINET_NOTIFY_EMAIL?.trim() ||
      CABINET_CONTACT.email;

    const emailText = buildMutuelleLeadEmailText(parsed.data, {
      enabled: alptis.enabled,
      called: alptis.called,
      status: alptis.status,
      errorMessage: alptis.errorMessage,
      summaryLines: alptis.summaryLines,
    });

    await sendMutuelleNotification({
      to: cabinetEmail,
      subject: "Nouvelle demande mutuelle depuis le site Lefevre Conseil",
      clientName: `${parsed.data.firstName} ${parsed.data.lastName}`,
      text: emailText,
    });

    return NextResponse.json({ ok: true, id: submitResult.id });
  } catch (e) {
    console.error("mutuelle submit API:", e);
    return NextResponse.json({ ok: true });
  }
}
