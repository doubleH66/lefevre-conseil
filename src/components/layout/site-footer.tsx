import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import {
  ACTUALITES_HREF,
  CONTACT_HREF,
  FAQ_HREF,
  INSTALLATION_HREF,
  NOTRE_CABINET_HREF,
  SERVICES_BASE_HREF,
} from "@/lib/content/routes";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { NewsletterSignup } from "@/components/client/newsletter-signup";
import { AURENIS_LOGO_URL, CABINET_CONTACT, SITE_LOGO_URL } from "@/lib/content/site";
import { cn } from "@/lib/utils";

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cookies", label: "Cookies" },
  { href: "/conditions-utilisation", label: "Conditions d’utilisation" },
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
  "text-[15px] font-normal leading-snug text-white/80 transition-colors duration-200 hover:text-white sm:text-base";

const footerColTitleClass = "text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55";

export function SiteFooter() {
  const year = new Date().getFullYear();
  const { phone, phoneTel, email, address } = CABINET_CONTACT;

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

        <div className="relative z-[2] px-5 py-12 sm:px-8 sm:py-14 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-x-10">
              <div className="lg:col-span-4">
                <Link href="/" aria-label={`${CABINET_CONTACT.name} - accueil`} className="inline-flex">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={SITE_LOGO_URL}
                    alt=""
                    className="h-9 w-auto max-w-[min(100%,220px)] object-contain object-left brightness-0 invert sm:h-10"
                  />
                </Link>
                <p className="mt-5 max-w-md text-left text-[15px] leading-[1.55] text-white/75 sm:text-base">
                  Cabinet indépendant - gestion de patrimoine, courtage et conseils aux particuliers et
                  professionnels.
                </p>
              </div>

              <FooterColumn className="lg:col-span-2" title="Navigation">
                <FooterLink href="/">Accueil</FooterLink>
                <FooterLink href={ACTUALITES_HREF}>Conseils</FooterLink>
                <FooterLink href={SERVICES_BASE_HREF}>Nos expertises</FooterLink>
                <FooterLink href={CONTACT_HREF}>Contact</FooterLink>
                <FooterLink href={NOTRE_CABINET_HREF}>À propos</FooterLink>
                <FooterLink href={FAQ_HREF}>FAQ</FooterLink>
                <FooterLink href={INSTALLATION_HREF}>Installer l’app</FooterLink>
              </FooterColumn>

              <FooterColumn className="lg:col-span-3" title="Légal">
                {legalLinks.map((link) => (
                  <FooterLink key={link.href} href={link.href}>
                    {link.label}
                  </FooterLink>
                ))}
              </FooterColumn>

              <div className="lg:col-span-3">
                <p className={footerColTitleClass}>Coordonnées</p>
                <ul className="mt-4 space-y-3">
                  <li>
                    <a
                      href={`tel:${phoneTel}`}
                      className="group flex items-start gap-2.5 text-[15px] leading-snug text-white/85 transition-colors hover:text-white"
                    >
                      <Phone className="mt-0.5 size-4 shrink-0 text-white/45 group-hover:text-white/70" aria-hidden />
                      <span className="font-medium tabular-nums">{phone}</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href={`mailto:${email}`}
                      className="group flex items-start gap-2.5 text-[15px] leading-snug text-white/85 transition-colors hover:text-white"
                    >
                      <Mail className="mt-0.5 size-4 shrink-0 text-white/45 group-hover:text-white/70" aria-hidden />
                      <span className="break-all">{email}</span>
                    </a>
                  </li>
                  <li className="flex items-start gap-2.5 text-[15px] leading-snug text-white/80">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-white/45" aria-hidden />
                    <address className="not-italic">
                      {address.street}
                      <br />
                      {address.postalCode} {address.city}
                    </address>
                  </li>
                </ul>

                {socialLinksActive.length > 0 ? (
                  <div className="mt-8">
                    <p className={footerColTitleClass}>Réseaux</p>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {socialLinksActive.map(({ href, label, Icon }) => (
                        <li key={label}>
                          <a
                            href={href}
                            aria-label={label}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex size-10 items-center justify-center rounded-full border border-white/35 bg-white/10 text-white/90 transition-colors duration-200 hover:bg-white/18"
                          >
                            <Icon className="size-4" aria-hidden />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-10 flex max-w-6xl flex-col items-center gap-8 border-t border-white/10 pt-10 sm:mt-12 sm:pt-12">
            <div className="flex w-full max-w-lg flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <ContactGlassLink light layout="hero" className="sm:min-w-[10rem]" />
              <NewsletterSignup
                presentation="dialog-trigger"
                variant="compact"
                idSuffix="footer"
                footerOnDark
              />
            </div>
            <p className="text-center text-[13px] text-white/50 sm:text-sm">
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
    </footer>
  );
}

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
    <div className={cn("text-left", className)}>
      <p className={footerColTitleClass}>{title}</p>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <Link href={href} className={footerLinkClass}>
        {children}
      </Link>
    </li>
  );
}
