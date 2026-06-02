import { NextResponse } from "next/server";
import { saveMutuelleDraft } from "@/lib/mutuelle/db";
import { clientIpFromRequest, checkRateLimit } from "@/lib/mutuelle/rate-limit";
import { mutuelleDraftSchema } from "@/lib/mutuelle/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const ip = clientIpFromRequest(request);
    if (!checkRateLimit(`mutuelle-draft:${ip}`).allowed) {
      return NextResponse.json({ error: "Trop de requêtes. Réessayez plus tard." }, { status: 429 });
    }

    const body: unknown = await request.json();
    const parsed = mutuelleDraftSchema.safeParse(body);
    if (!parsed.success) {
      const message = parsed.error.issues[0]?.message ?? "Données invalides";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (parsed.data.website?.trim()) {
      return NextResponse.json({ ok: true, id: crypto.randomUUID() });
    }

    const result = await saveMutuelleDraft(parsed.data);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: result.id });
  } catch (e) {
    console.error("mutuelle draft API:", e);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
