import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, BookOpen, Calendar, Tag } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { ShareButton } from "@/components/ui/share-modal";
import type { Article } from "@/lib/content/articles";
import { CONSEILS_HREF, CONTACT_HREF, articleHref } from "@/lib/content/routes";
import { CABINET_CONTACT, SITE_URL } from "@/lib/content/site";

const ARTICLE_FAQ: Record<string, { q: string; a: string }[]> = {};

export function ArticleDetailPage({ article }: { article: Article }) {
  const faq = ARTICLE_FAQ[article.slug] ?? [];

  return (
    <MarketingSubpage
      hero={{
        title: article.title,
        tagline: `${article.category} · ${article.date} · ${article.readTime} de lecture`,
        titleId: "article-hero-title",
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Conseils", href: CONSEILS_HREF },
        { label: article.category },
      ]}
    >
      <div className="bg-white pb-16">
        <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">

          {/* Back link */}
          <Link
            href={CONSEILS_HREF}
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#1f2a7c]/55 transition-colors hover:text-[#1f2a7c]"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Retour aux conseils
          </Link>

          <div className="grid gap-8 lg:grid-cols-[16rem_1fr] lg:items-start lg:gap-10">

            {/* ── Sidebar sticky ── */}
            <aside className="flex flex-col gap-4 lg:sticky lg:top-28">

              {/* Article meta card */}
              <div className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm">
                <div className="relative h-28 w-full overflow-hidden bg-[#1f2a7c]/5">
                  <Image
                    src={article.image}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="256px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/60 to-transparent" />
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1f2a7c]/8 px-3 py-1 text-[11px] font-semibold text-[#1f2a7c]">
                      <Tag className="size-3" aria-hidden />
                      {article.category}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2.5 border-t border-neutral-100 pt-4">
                    <InfoRow icon={<Calendar className="size-3.5" />} label="Publié le">
                      {article.date}
                    </InfoRow>
                    <InfoRow icon={<BookOpen className="size-3.5" />} label="Lecture">
                      {article.readTime}
                    </InfoRow>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <Link
                href={CONTACT_HREF}
                className="group flex flex-col gap-2 rounded-2xl border border-[#1f2a7c]/15 bg-[#1f2a7c] p-4 text-white transition-opacity hover:opacity-90"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
                  Une question ?
                </p>
                <p className="text-[15px] font-semibold leading-snug">
                  Parlez-en avec le cabinet
                </p>
                <p className="text-sm text-white/65">
                  {CABINET_CONTACT.phone} · Perpignan
                </p>
              </Link>

            </aside>

            {/* ── Article body ── */}
            <article>
              {/* Hero image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-[#1f2a7c]/5">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  unoptimized
                  priority
                  className="object-cover"
                  sizes="(max-width:1024px) 100vw, 700px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1f2a7c]/35 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {article.category}
                  </span>
                  <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    {article.date}
                  </span>
                  <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    {article.readTime} de lecture
                  </span>
                </div>
              </div>

              {/* Excerpt highlight */}
              <div className="mt-6 rounded-2xl border border-[#1f2a7c]/10 bg-[#1f2a7c]/[0.03] px-6 py-5">
                <p className="text-[15px] font-medium leading-relaxed text-[#1f2a7c]/80 sm:text-base">
                  {article.excerpt}
                </p>
              </div>

              {/* Body placeholder */}
              <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-[#1f2a7c]/72">
                <p>
                  Le contenu complet de cet article est en cours de migration. En attendant, nos conseillers
                  répondent directement à vos questions lors d'un premier échange téléphonique ou en cabinet.
                </p>
                <p>
                  Pour approfondir le sujet <strong className="font-semibold text-[#1f2a7c]">« {article.title} »</strong>,
                  contactez Lefèvre Conseil à {CABINET_CONTACT.address.city} au{" "}
                  <a href={`tel:${CABINET_CONTACT.phoneTel}`} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
                    {CABINET_CONTACT.phone}
                  </a>.
                </p>
              </div>

              {faq.length > 0 ? (
                <div className="mt-10">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#1f2a7c]/45">
                    Questions fréquentes
                  </p>
                  <FaqAccordion items={faq} />
                </div>
              ) : null}

              <div className="mt-10 border-t border-neutral-100 pt-8 flex items-center justify-between gap-4 flex-wrap">
                <Link
                  href={CONSEILS_HREF}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#1f2a7c]/60 transition-colors hover:text-[#1f2a7c]"
                >
                  <ArrowLeft className="size-4" aria-hidden />
                  Tous les conseils
                </Link>
                <ShareButton title={article.title} url={`${SITE_URL}${articleHref(article.slug)}`} />
              </div>
            </article>
          </div>
        </div>
      </div>
    </MarketingSubpage>
  );
}

function InfoRow({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="shrink-0 text-[#1f2a7c]/40">{icon}</span>
      <span className="text-[11px] text-[#1f2a7c]/45">{label}</span>
      <span className="ml-auto text-[12px] font-medium text-[#1f2a7c]">{children}</span>
    </div>
  );
}
