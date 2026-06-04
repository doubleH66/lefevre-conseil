import type { ReactNode } from "react";
import Link from "next/link";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import {
  AVIS_HREF,
  CONSEILS_HREF,
  CONTACT_HREF,
  EXPERTISES_BASE_HREF,
  FAQ_HREF,
  INSTALLATION_HREF,
  NOTRE_CABINET_HREF,
  ROUTES,
} from "@/lib/content/routes";
import { NewsletterSignup } from "@/components/client/newsletter-signup";
import { AURENIS_LOGO_URL, CABINET_CONTACT, SITE_LOGO_URL } from "@/lib/content/site";
import { navGlassRest } from "@/lib/styles/glass";
import { cn } from "@/lib/utils";

const footerGlassBtnClass = cn(
  "inline-flex cursor-pointer items-center justify-center rounded-full outline-none transition-[background-color,box-shadow] duration-150 focus-visible:ring-[3px] focus-visible:ring-white/30 hover:bg-white/[0.16]",
  navGlassRest,
);

const legalLinks = [
  { href: ROUTES.mentionsLegales, label: "Mentions légales" },
  { href: ROUTES.confidentialite, label: "Confidentialité" },
  { href: ROUTES.cookies, label: "Cookies" },
  { href: ROUTES.conditionsUtilisation, label: "Conditions d’utilisation" },
  { href: ROUTES.reclamations, label: "Réclamations clients" },
] as const;

const navigationLinks = [
  { href: "/", label: "Accueil" },
  { href: CONSEILS_HREF, label: "Conseils" },
  { href: EXPERTISES_BASE_HREF, label: "Nos expertises" },
  { href: CONTACT_HREF, label: "Contact" },
  { href: NOTRE_CABINET_HREF, label: "À propos" },
  { href: AVIS_HREF, label: "Avis clients" },
  { href: FAQ_HREF, label: "FAQ" },
  { href: INSTALLATION_HREF, label: "Installer l’app" },
] as const;

const socialLinks = [
  { href: CABINET_CONTACT.social.facebook, label: "Facebook", Icon: Facebook },
  { href: CABINET_CONTACT.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: CABINET_CONTACT.social.instagram, label: "Instagram", Icon: Instagram },
] as const;

const socialLinksActive = socialLinks.filter((s) => typeof s.href === "string" && s.href.length > 0);

const footerHeroShellClass =
  "relative isolate overflow-hidden rounded-3xl border border-black/10 bg-black shadow-[0_24px_80px_-32px_rgba(0,0,0,0.55)] lg:rounded-[3rem]";

const footerLinkClass =
  "text-sm leading-snug text-white/75 transition-colors duration-150 hover:text-white sm:text-[15px]";

const footerLegalLinkClass =
  "text-xs text-white/48 transition-colors duration-150 hover:text-white/75 sm:text-sm";

const footerColumnTitleClass =
  "mb-4 text-base font-semibold tracking-[-0.03em] text-white lg:mb-5 lg:text-lg lg:leading-tight";

const TAGLINE =
  "Cabinet indépendant — gestion de patrimoine, courtage et conseils aux particuliers et professionnels.";

function FooterColumn({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <h3 className={footerColumnTitleClass}>{title}</h3>
      {children}
    </div>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { phone, phoneTel, email, address } = CABINET_CONTACT;
  const mapsQuery = encodeURIComponent(
    `${address.street} ${address.postalCode} ${address.city}`,
  );

  return (
    <footer className="relative z-[2] mx-2.5 mt-12 mb-10 sm:mx-3 sm:mb-12 lg:mx-4 lg:mb-14">
      <div className={footerHeroShellClass}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#1f2a7c]/90 via-[#151d52]/95 to-black"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-black/50 via-transparent to-transparent"
        />

        <div className="relative z-[2] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-x-10 xl:gap-x-12">
              <section aria-labelledby="footer-brand" className="lg:col-span-5">
                <Link href="/" aria-label={`${CABINET_CONTACT.name} — accueil`} className="inline-flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SITE_LOGO_URL}
                    alt="Lefèvre Conseil"
                    className="h-9 w-auto max-w-[min(100%,220px)] object-contain object-left brightness-0 invert sm:h-10"
                  />
                </Link>
                <p
                  id="footer-brand"
                  className="mt-5 max-w-md text-sm leading-[1.7] text-white/72 sm:text-[15px]"
                >
                  {TAGLINE}
                </p>

                <div className="mt-8 max-w-sm">
                  <p className="text-sm leading-relaxed text-white/65">
                    Recevez nos actualités patrimoniales, environ une fois par mois.
                  </p>
                  <NewsletterSignup
                    presentation="dialog-trigger"
                    variant="compact"
                    idSuffix="footer"
                    footerOnDark
                    className="mt-4 !justify-start"
                  />
                </div>

                {socialLinksActive.length > 0 ? (
                  <ul className="mt-7 flex flex-wrap gap-2.5" aria-label="Réseaux sociaux">
                    {socialLinksActive.map(({ href, label, Icon }) => (
                      <li key={label}>
                        <a
                          href={href}
                          aria-label={label}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={cn(footerGlassBtnClass, "size-10 sm:size-11")}
                        >
                          <Icon className="size-4" aria-hidden />
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>

              <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7 lg:grid-cols-2 lg:gap-x-8">
                <FooterColumn title="Pages du site">
                  <ul className="flex flex-col gap-2.5">
                    {navigationLinks.map((link) => (
                      <li key={link.href}>
                        <Link href={link.href} className={footerLinkClass}>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </FooterColumn>

                <FooterColumn title="Coordonnées">
                  <ul className="flex flex-col gap-3 text-sm leading-snug text-white/75 sm:text-[15px]">
                    <li>
                      <a href={`tel:${phoneTel}`} className="transition-colors hover:text-white">
                        <span className="block font-medium tabular-nums text-white/90">{phone}</span>
                        <span className="mt-1 block text-sm text-white/50">
                          {CABINET_CONTACT.openingHours.label}
                        </span>
                      </a>
                    </li>
                    <li>
                      <a href={`mailto:${email}`} className="break-all transition-colors hover:text-white">
                        {email}
                      </a>
                    </li>
                    <li>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-white"
                      >
                        <span className="block text-white/90">{address.street}</span>
                        <span className="block">
                          {address.postalCode} {address.city}
                        </span>
                      </a>
                    </li>
                    <li>
                      <Link href={CONTACT_HREF} className={footerLinkClass}>
                        Formulaire de contact
                      </Link>
                    </li>
                  </ul>
                </FooterColumn>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-6xl border-t border-white/10 pt-8 sm:mt-14 sm:pt-10">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:justify-start">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLegalLinkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-col items-center gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-center text-sm text-white/48 sm:text-left">
                © {year} {CABINET_CONTACT.name}
              </p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={AURENIS_LOGO_URL}
                alt="Aurenis"
                width={120}
                height={28}
                className="h-6 w-auto brightness-0 invert opacity-80 sm:h-7"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
