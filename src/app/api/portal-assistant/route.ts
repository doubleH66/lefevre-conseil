import { NextResponse } from "next/server";

type Body = {
  mode?: "admin" | "client";
  task?: "brief" | "blog";
  blogTopic?: string;
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

function fallbackBlogDraft(topic: string) {
  return [
    `# ${topic.charAt(0).toUpperCase()}${topic.slice(1)}`,
    "",
    "En gestion de patrimoine, ce sujet revient souvent dans les échanges avec nos clients. Voici une lecture claire pour mieux décider, sans engagement.",
    "",
    "## Comprendre les enjeux",
    `Pour aborder « ${topic} », commencez par clarifier votre horizon, votre situation familiale et professionnelle, ainsi que vos priorités (sécurité, revenus, transmission, fiscalité).`,
    "",
    "## Pistes à explorer",
    "- Faire le point sur l’existant (épargne, contrats, retraite, protection).",
    "- Identifier les leviers adaptés à votre profil, avec leurs avantages et limites.",
    "- Anticiper l’impact fiscal et la liquidité avant toute décision.",
    "",
    "## Prochaine étape",
    "Un échange personnalisé permet d’affiner ces éléments. Le premier rendez-vous au cabinet Lefèvre Conseil est offert et sans engagement.",
    "",
    "_Brouillon généré hors ligne — complétez ou relancez l’IA avec OPENAI_API_KEY configurée sur le serveur._",
  ].join("\n");
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
  const task = body.task === "blog" ? "blog" : "brief";
  const blogTopic = typeof body.blogTopic === "string" ? body.blogTopic.trim() : "";

  if (task === "blog" && !blogTopic) {
    return NextResponse.json({ error: "Sujet du billet requis." }, { status: 400 });
  }

  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({
      source: "fallback" as const,
      reply: task === "blog" ? fallbackBlogDraft(blogTopic) : fallbackBrief(weeklyActions, stats),
    });
  }

  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini";
  const system =
    task === "blog"
      ? "Tu rédiges des articles pour la rubrique « Conseils » du cabinet Lefèvre Conseil (gestion de patrimoine, Perpignan). Format markdown : titre H1, chapô (2 phrases), 3 sections H2 avec paragraphes courts. Ton professionnel, pédagogique, sans promesses excessives ni conseil personnalisé. Pas de listes à puces trop longues."
      : "Tu es un assistant interne pour un cabinet (portail client/admin). Réponds en français, ton professionnel et concis (8-12 phrases max). Priorise les actions du jour sans inventer de données absentes du contexte JSON.";

  const userPayload =
    task === "blog"
      ? `Rédige un brouillon d'article Conseils sur le sujet : « ${blogTopic} ». Public : particuliers, dirigeants et professions libérales.`
      : `Contexte JSON :\n${JSON.stringify({
          mode: body.mode ?? "admin",
          weeklyActions,
          stats: stats ?? {},
        })}\n\nPropose ce qu'on fait aujourd'hui : 3-5 priorités numérotées, puis une phrase sur les risques ou relances à anticiper.`;

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
          { role: "user", content: userPayload },
        ],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      const fallback = task === "blog" ? fallbackBlogDraft(blogTopic) : fallbackBrief(weeklyActions, stats);
      return NextResponse.json(
        {
          source: "fallback" as const,
          reply: `${fallback}\n\n_(L’IA n’a pas répondu : ${res.status} ${errText.slice(0, 120)})_`,
        },
        { status: 200 },
      );
    }

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const reply = data.choices?.[0]?.message?.content?.trim();
    const fallback = task === "blog" ? fallbackBlogDraft(blogTopic) : fallbackBrief(weeklyActions, stats);
    if (!reply) {
      return NextResponse.json({ source: "fallback" as const, reply: fallback });
    }
    return NextResponse.json({ source: "openai" as const, reply });
  } catch {
    return NextResponse.json({
      source: "fallback" as const,
      reply: task === "blog" ? fallbackBlogDraft(blogTopic) : fallbackBrief(weeklyActions, stats),
    });
  }
}
