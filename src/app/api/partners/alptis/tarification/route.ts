import { NextResponse } from "next/server";
import { mutuelleSubmitSchema } from "@/lib/mutuelle/schema";
import { runAlptisTarificationIfEnabled } from "@/lib/partners/alptis/client";
import { isAlptisApiEnabled } from "@/lib/partners/alptis/config";
import { clientIpFromRequest, checkRateLimit } from "@/lib/mutuelle/rate-limit";

export const runtime = "nodejs";

/** Tarification interne — ne pas exposer au parcours prospect. */
export async function POST(request: Request) {
  if (!isAlptisApiEnabled()) {
    return NextResponse.json({ error: "API Alptis désactivée" }, { status: 403 });
  }

  const ip = clientIpFromRequest(request);
  if (!checkRateLimit(`alptis-tarif:${ip}`).allowed) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }

  try {
    const body: unknown = await request.json();
    const leadId = (body as { leadId?: string })?.leadId;
    const parsed = mutuelleSubmitSchema.safeParse(body);
    if (!parsed.success || !leadId) {
      return NextResponse.json({ error: "Payload invalide" }, { status: 400 });
    }

    const outcome = await runAlptisTarificationIfEnabled(leadId, parsed.data);
    return NextResponse.json({
      status: outcome.status,
      summaryLines: outcome.summaryLines,
    });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
