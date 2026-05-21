import Link from "next/link";
import { SubpageShell } from "@/components/layout/subpage-shell";
import { FaqAccordion } from "@/components/client/faq-accordion";
import { SectionHeading } from "@/components/services/section-heading";
import { TrustStats } from "@/components/services/trust-stats";
import { BreadcrumbJsonLd, FAQPageJsonLd, ServiceJsonLd } from "@/components/seo/page-jsonld";
import type { ServicePremiumContent } from "@/lib/content/service-premium-types";
import {
  SERVICE_CATALOG,
  getServiceBySlug,
  serviceDetailHref,
} from "@/lib/content/services";
import { SERVICES_BASE_HREF } from "@/lib/content/routes";
import { SUBPAGE_DEFISCAL_HERO_MIN_CLASS } from "@/lib/content/page-heroes";
import { cn } from "@/lib/utils";

type ServicePremiumPageProps = {
  content: ServicePremiumContent;
  children?: React.ReactNode;
};

export function ServicePremiumPage({ content, children }: ServicePremiumPageProps) {
  const catalog = getServiceBySlug(content.slug);
  const path = `${SERVICES_BASE_HREF}/${content.slug}`;
  const breadcrumbLabel = catalog?.title ?? content.hero.h1;

  const relatedLinks = content.internalLinks
    .filter((link) => link.slug !== content.slug)
    .map((link) => {
      const service = getServiceBySlug(link.slug);
      return {
        href: serviceDetailHref(link.slug),
        name: link.label || service?.title || link.slug,
      };
    });

  return (
    <SubpageShell
      heroMinHeightClass={SUBPAGE_DEFISCAL_HERO_MIN_CLASS}
      heroLead={{
        title: content.hero.h1,
        tagline: content.hero.subtitle,
        titleId: `service-hero-${content.slug}`,
        taglineHighlightAfter: content.hero.taglineHighlightAfter,
        intro: content.hero.intro,
        showHeroCtas: true,
      }}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Nos expertises", href: SERVICES_BASE_HREF },
        { label: breadcrumbLabel },
      ]}
    >
      <ServiceJsonLd
        name={content.hero.h1}
        description={content.meta.description}
        path={path}
        category={catalog?.title ?? "Gestion de patrimoine"}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Nos expertises", path: SERVICES_BASE_HREF },
          { name: breadcrumbLabel, path },
        ]}
      />
      <FAQPageJsonLd items={content.faq} />

      <main className="mx-auto w-full max-w-5xl flex-1 bg-[#f2f3f7] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto flex max-w-3xl justify-center">
          <TrustStats />
        </div>

        <section aria-labelledby="why-important-title" className="mt-10 sm:mt-14">
          <SectionHeading
            align="center"
            titleId="why-important-title"
            eyebrow="Pourquoi c’est important"
            title={content.whyImportant.title}
          />
          <div className="mx-auto mt-8 max-w-3xl space-y-4 text-center text-[15px] leading-relaxed text-neutral-600 sm:text-base">
            {content.whyImportant.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="accompaniment-title" className="mt-16 sm:mt-20">
          <SectionHeading
            align="center"
            titleId="accompaniment-title"
            eyebrow="Notre accompagnement"
            title={content.accompaniment.title}
            description="Une démarche structurée, expliquée à chaque étape."
          />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {content.accompaniment.steps.map((step, index) => (
              <li
                key={step.title}
                className="relative rounded-2xl border border-neutral-200/90 bg-neutral-50/60 p-5 sm:p-6"
              >
                <span className="text-xs font-semibold tracking-[0.16em] text-[#1f2a7c]/55">
                  Étape {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-[15px] font-semibold text-neutral-900 sm:text-base">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="solutions-title" className="mt-16 sm:mt-20">
          <SectionHeading
            align="center"
            titleId="solutions-title"
            eyebrow="Solutions possibles"
            title={content.solutions.title}
            description={
              content.solutions.intro ??
              "Les options étudiées dépendent de votre profil, de votre horizon et de votre fiscalité."
            }
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.solutions.items.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6"
              >
                <h3 className="text-[15px] font-semibold text-neutral-900 sm:text-base">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="for-who-title" className="mt-16 sm:mt-20">
          <SectionHeading align="center" titleId="for-who-title" eyebrow="Pour qui ?" title={content.forWho.title} />
          <ul className="mt-8 flex flex-wrap justify-center gap-2.5">
            {content.forWho.profiles.map((profile) => (
              <li
                key={profile}
                className="rounded-full border border-[#1f2a7c]/15 bg-white px-4 py-2 text-sm font-medium text-[#1f2a7c] shadow-sm"
              >
                {profile}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="why-us-title" className="mt-16 sm:mt-20">
          <SectionHeading align="center" titleId="why-us-title" eyebrow="Le cabinet" title={content.whyUs.title} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {content.whyUs.points.map((point) => (
              <article key={point.title} className="rounded-2xl border border-neutral-200/90 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="text-[15px] font-semibold text-neutral-900 sm:text-base">{point.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{point.description}</p>
              </article>
            ))}
          </div>
        </section>

        {children}

        <aside
          aria-labelledby="summary-title"
          className="mt-16 rounded-2xl border border-[#1f2a7c]/12 bg-white p-6 shadow-sm sm:mt-20 sm:p-8"
        >
          <h2 id="summary-title" className="text-lg font-semibold text-[#1f2a7c]">
            {content.summary.title}
          </h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-neutral-700">
            {content.summary.bullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </aside>

        <section aria-labelledby="faq-title" className="mt-16 sm:mt-20">
          <SectionHeading
            align="center"
            titleId="faq-title"
            eyebrow="Questions fréquentes"
            title="Vos questions, nos réponses."
          />
          <div className="mt-8">
            <FaqAccordion items={content.faq} />
          </div>
        </section>

        {relatedLinks.length > 0 ? (
          <section aria-labelledby="other-services-title" className="mt-16 sm:mt-20">
            <p id="other-services-title" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              Voir aussi
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {relatedLinks.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-neutral-200/90 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:border-[#1f2a7c]/25"
                  >
                    <span>{service.name}</span>
                    <span aria-hidden className="text-[#1f2a7c]/45 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="more-links-title" className="mt-10 sm:mt-12">
          <p id="more-links-title" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
            Aller plus loin
          </p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {SERVICE_CATALOG.filter(
              (s) => !relatedLinks.some((r) => r.href === serviceDetailHref(s.slug)) && s.slug !== content.slug,
            )
              .slice(0, 2)
              .map((service) => (
                <li key={service.slug}>
                  <Link
                    href={serviceDetailHref(service.slug)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-neutral-200/90 bg-white px-4 py-3.5 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:border-[#1f2a7c]/25"
                  >
                    <span>{service.title}</span>
                    <span aria-hidden className="text-[#1f2a7c]/45 transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      </main>
    </SubpageShell>
  );
}
