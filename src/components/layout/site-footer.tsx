"use client";

import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin } from "lucide-react";
import { NewsletterSignup } from "@/components/client/newsletter-signup";
import { FlickeringFooter } from "@/components/ui/flickering-footer";
import {
  AVIS_HREF,
  CONSEILS_HREF,
  CONTACT_HREF,
  EXPERTISES_BASE_HREF,
  FAQ_HREF,
  NOTRE_CABINET_HREF,
  ROUTES,
} from "@/lib/content/routes";
import { AURENIS_LOGO_URL, CABINET_CONTACT, SITE_LOGO_URL } from "@/lib/content/site";

const TAGLINE =
  "Cabinet indépendant — gestion de patrimoine, courtage et conseils aux particuliers et professionnels.";

const socialLinks = [
  { href: CABINET_CONTACT.social.facebook, label: "Facebook", Icon: Facebook },
  { href: CABINET_CONTACT.social.linkedin, label: "LinkedIn", Icon: Linkedin },
  { href: CABINET_CONTACT.social.instagram, label: "Instagram", Icon: Instagram },
] as const;

const socialLinksActive = socialLinks.filter((s) => s.href.length > 0);

const footerSocialBtnClass =
  "inline-flex size-10 items-center justify-center rounded-full bg-[#1f2a7c] text-white outline-none transition-colors duration-150 hover:bg-[#18226b] focus-visible:ring-[3px] focus-visible:ring-[#1f2a7c]/20 sm:size-11";

function FooterCtaAndNewsletter() {
  return (
    <div className="flex flex-col gap-5">
      <Link
        href={CONTACT_HREF}
        className="group inline-flex h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#1f2a7c] px-6 text-sm font-semibold text-white transition-colors duration-150 hover:bg-[#18226b]"
      >
        Prendre rendez-vous
        <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
      <NewsletterSignup presentation="inline" idSuffix="footer" />
    </div>
  );
}

function FooterSocialLinks() {
  if (socialLinksActive.length === 0) return null;

  return (
    <div>
      <p className="mb-2.5 text-sm font-semibold text-[#1f2a7c]">Réseaux sociaux</p>
      <ul className="flex flex-wrap gap-2.5" aria-label="Réseaux sociaux">
        {socialLinksActive.map(({ href, label, Icon }) => (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              target="_blank"
              rel="noopener noreferrer"
              className={footerSocialBtnClass}
            >
              <Icon className="size-4" aria-hidden />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Pied de page — gabarit DAS Bâtiment / Aurenis (colonnes + grille flickering). */
export function SiteFooter() {
  const year = new Date().getFullYear();
  const { phone, phoneTel, email, address } = CABINET_CONTACT;
  const mapsQuery = encodeURIComponent(`${address.street} ${address.postalCode} ${address.city}`);

  return (
    <FlickeringFooter
      brandName={CABINET_CONTACT.name}
      logoSrc={SITE_LOGO_URL}
      description={TAGLINE}
      copyright={`© ${year} ${CABINET_CONTACT.name} — Tous droits réservés`}
      creditLogoSrc={AURENIS_LOGO_URL}
      creditAlt="Aurenis"
      creditHref="https://heyaurenis.com"
      brandExtra={<FooterCtaAndNewsletter />}
      columns={[
        {
          title: "Navigation",
          links: [
            { id: 1, title: "Accueil", url: ROUTES.home },
            { id: 2, title: "Notre cabinet", url: NOTRE_CABINET_HREF },
            { id: 3, title: "Nos expertises", url: EXPERTISES_BASE_HREF },
            { id: 4, title: "Conseils", url: CONSEILS_HREF },
            { id: 5, title: "Avis clients", url: AVIS_HREF },
            { id: 6, title: "FAQ", url: FAQ_HREF },
            { id: 7, title: "Contact", url: CONTACT_HREF },
          ],
        },
        {
          title: "Informations",
          links: [
            { id: 10, title: phone, url: `tel:${phoneTel}` },
            { id: 11, title: email, url: `mailto:${email}` },
            {
              id: 12,
              title: `${address.street}, ${address.postalCode} ${address.city}`,
              url: `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`,
              external: true,
            },
            { id: 13, title: CABINET_CONTACT.openingHours.label, url: CONTACT_HREF },
          ],
        },
        {
          title: "Outils",
          links: [
            { id: 20, title: "Simulateur patrimonial", url: ROUTES.simulateur },
            { id: 21, title: "Comparateur assurance", url: ROUTES.comparateur },
            { id: 22, title: "Installer l’application", url: ROUTES.installation },
          ],
          extra: <FooterSocialLinks />,
        },
      ]}
      legalLinks={[
        { title: "Mentions légales", href: ROUTES.mentionsLegales },
        { title: "Confidentialité", href: ROUTES.confidentialite },
        { title: "Cookies", href: ROUTES.cookies },
        { title: "Conditions d’utilisation", href: ROUTES.conditionsUtilisation },
        { title: "Réclamations clients", href: ROUTES.reclamations },
      ]}
    />
  );
}
