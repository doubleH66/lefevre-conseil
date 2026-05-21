"use client";

import * as React from "react";
import { Download, MonitorSmartphone, Smartphone, Monitor, CheckCircle2 } from "lucide-react";
import { MarketingSubpage } from "@/components/layout/marketing-subpage";
import {
  MarketingHeading,
  MarketingPageStack,
  MarketingSection,
} from "@/components/marketing/marketing-section";
import { marketingCardClass, marketingPageShellClass } from "@/components/marketing/marketing-styles";
import { PAGE_HEROES } from "@/lib/content/page-heroes";
import { FAQ_HREF, ROUTES } from "@/lib/content/routes";
import { cn } from "@/lib/utils";
import Link from "next/link";

const steps = [
  {
    id: "ios",
    icon: Smartphone,
    title: "iPhone et iPad",
    subtitle: "Safari uniquement",
    items: [
      "Ouvrez le site dans Safari.",
      "Appuyez sur le bouton Partager (carré avec flèche vers le haut).",
      'Faites défiler et choisissez "Sur l\'écran d\'accueil".',
      'Nommez l\'app "Lefèvre Conseil" puis appuyez sur "Ajouter".',
    ],
  },
  {
    id: "android",
    icon: MonitorSmartphone,
    title: "Android",
    subtitle: "Chrome · Firefox · Edge",
    items: [
      "Ouvrez le site dans Chrome (ou un navigateur compatible).",
      'Appuyez sur le menu ⋮ puis "Installer l\'application".',
      "Confirmez. L'icône apparaît sur votre écran d'accueil.",
    ],
  },
  {
    id: "desktop",
    icon: Monitor,
    title: "Ordinateur",
    subtitle: "Chrome · Edge · Safari macOS",
    items: [
      "Sur Chrome ou Edge : cherchez l'icône d'installation dans la barre d'adresse.",
      'Sur Safari macOS : File > "Ajouter à l\'accueil" ou créez un favori dans le dock.',
    ],
  },
] as const;

const benefits = [
  "Accès en un clic, sans passer par le navigateur",
  "Fonctionne même avec une connexion limitée",
  "Pas d'App Store ni de téléchargement",
  "Toujours à jour, automatiquement",
] as const;

export function InstallationPage() {
  const [installable, setInstallable] = React.useState(false);
  const [installed, setInstalled] = React.useState(false);

  React.useEffect(() => {
    const check = () => {
      const w = window as Window & { __pwaInstallPrompt?: Event };
      if (w.__pwaInstallPrompt) setInstallable(true);
    };
    check();
    window.addEventListener("pwa-installable", check);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setInstalled(true);
    }

    return () => window.removeEventListener("pwa-installable", check);
  }, []);

  async function handleInstall() {
    const w = window as Window & { __pwaInstallPrompt?: BeforeInstallPromptEvent };
    const prompt = w.__pwaInstallPrompt;
    if (!prompt) return;
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setInstallable(false);
      delete w.__pwaInstallPrompt;
    }
  }

  return (
    <MarketingSubpage
      hero={PAGE_HEROES.installation}
      breadcrumbs={[
        { label: "Accueil", href: "/" },
        { label: "Installer l'app" },
      ]}
    >
      <MarketingPageStack className={marketingPageShellClass}>

        {/* CTA natif — visible seulement si le navigateur supporte beforeinstallprompt */}
        {(installable || installed) && (
          <MarketingSection labelledBy="install-native-title">
            <div className={cn(marketingCardClass, "flex flex-col items-center gap-5 bg-[#1f2a7c] p-8 text-center text-white sm:flex-row sm:text-left")}>
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                {installed ? (
                  <CheckCircle2 className="size-7 text-white" />
                ) : (
                  <Download className="size-7 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h2 id="install-native-title" className="text-lg font-semibold">
                  {installed ? "Application déjà installée" : "Installer l'application"}
                </h2>
                <p className="mt-1 text-sm text-white/75">
                  {installed
                    ? "Vous pouvez accéder à Lefèvre Conseil directement depuis votre écran d'accueil."
                    : "Votre navigateur propose l'installation native — ajoutez l'app en un clic."}
                </p>
              </div>
              {!installed && (
                <button
                  onClick={handleInstall}
                  className="shrink-0 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#1f2a7c] transition-opacity hover:opacity-90"
                >
                  Installer maintenant
                </button>
              )}
            </div>
          </MarketingSection>
        )}

        {/* Bénéfices */}
        <MarketingSection labelledBy="benefits-title">
          <MarketingHeading titleId="benefits-title" title="Pourquoi installer l'app ?" align="left" />
          <ul className={cn(marketingCardClass, "mt-6 divide-y divide-[#1f2a7c]/6")}>
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 px-5 py-3.5">
                <CheckCircle2 className="size-4 shrink-0 text-[#1f2a7c]/50" aria-hidden />
                <span className="text-sm text-[#1f2a7c]/80">{b}</span>
              </li>
            ))}
          </ul>
        </MarketingSection>

        {/* Guide par plateforme */}
        {steps.map((block) => {
          const Icon = block.icon;
          return (
            <MarketingSection key={block.id} labelledBy={`${block.id}-title`}>
              <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-xl bg-[#1f2a7c]/8">
                  <Icon className="size-4.5 text-[#1f2a7c]" aria-hidden />
                </div>
                <div>
                  <h2 id={`${block.id}-title`} className="text-base font-semibold text-[#1f2a7c]">
                    {block.title}
                  </h2>
                  <p className="text-xs text-[#1f2a7c]/55">{block.subtitle}</p>
                </div>
              </div>
              <ol className={cn(marketingCardClass, "mt-4 list-none space-y-0 divide-y divide-[#1f2a7c]/6 p-0")}>
                {block.items.map((item, i) => (
                  <li key={item} className="flex gap-3 px-5 py-3.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f2a7c]/8 text-[11px] font-semibold text-[#1f2a7c]">
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-[#1f2a7c]/80">{item}</span>
                  </li>
                ))}
              </ol>
            </MarketingSection>
          );
        })}

        {/* À savoir */}
        <MarketingSection labelledBy="limits-title">
          <div className={cn(marketingCardClass, "bg-[#fafbfc] p-6")}>
            <h2 id="limits-title" className="text-base font-semibold text-[#1f2a7c]">
              À savoir
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#1f2a7c]/75">
              L'application web s'actualise automatiquement à chaque visite — pas besoin de mise à jour
              manuelle. Elle fonctionne même avec une connexion dégradée grâce à un cache local.
            </p>
            <p className="mt-4 text-sm">
              <Link href={FAQ_HREF} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
                FAQ
              </Link>
              {" · "}
              <Link href={ROUTES.simulateur} className="font-semibold text-[#1f2a7c] underline-offset-2 hover:underline">
                Simulateur
              </Link>
            </p>
          </div>
        </MarketingSection>

      </MarketingPageStack>
    </MarketingSubpage>
  );
}

// Type étendu pour l'API beforeinstallprompt (non standard, donc absent des types DOM)
interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
