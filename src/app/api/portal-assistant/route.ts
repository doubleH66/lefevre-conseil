import { NextResponse } from "next/server";

type Body = {
  mode?: "admin" | "client";
  weeklyActions?: { id: string; label: string; category: string }[];
  stats?: Record<string, number | string>;
};

function fallbackBrief(actions: Body["weeklyActions"], stats: Body["stats"]) {
  const lines = (actions ?? []).slice(0, 6).map((a) => `• ${a.label} (${a.category})`);
  const statsLine = stats
    ? Object.entries(stats)
        .map(([k, v]) => `${k}: ${v}`)
        .join(" · ")
    : "";
  return [
    "Synthèse priorisée pour aujourd’hui (mode hors ligne - aucune clé OPENAI_API_KEY sur le serveur).",
    "",
    "Focus immédiat :",
    ...lines,
    statsLine ? `\nIndicateurs : ${statsLine}` : "",
    "",
    "Conseil : traiter d’abord les sujets Opérations ou Suivi, puis enchaîner sur le contenu et le SEO.",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(req: Request) {
  let body: Body = {};
  try {
    body = (await req.json()) as Body;
  } catch {
    body = {};
  }

  const weeklyActions = Array.isArray(body.weeklyActions) ? body.weeklyActions : [];
  const stats = body.stats && typeof body.stats === "object" ? body.stats : undefined;

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({
      source: "fallback" as const,
      reply: fallbackBrief(weeklyActions, stats),
    });
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const system =
    "Tu es un assistant interne pour un cabinet (portail client/admin). Réponds en français, ton professionnel et concis (8-12 phrases max). Priorise les actions du jour sans inventer de données absentes du contexte JSON.";

  const userPayload = JSON.stringify({
    mode: body.mode ?? "admin",
    weeklyActions,
    stats: stats ?? {},
  });

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Contexte JSON :\n${userPayload}\n\nPropose ce qu'on fait aujourd'hui : 3-5 priorités numérotées, puis une phrase sur les risques ou relances à anticiper.`,
          },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        {
          source: "fallback" as const,
          reply: `${fallbackBrief(weeklyActions, stats)}\n\n_(L’IA n’a pas répondu : ${res.status} ${errText.slice(0, 120)})_`,
        },
        { status: 200 },
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      return NextResponse.json({ source: "fallback" as const, reply: fallbackBrief(weeklyActions, stats) });
    }
    return NextResponse.json({ source: "openai" as const, reply });
  } catch {
    return NextResponse.json({ source: "fallback" as const, reply: fallbackBrief(weeklyActions, stats) });
  }
}
