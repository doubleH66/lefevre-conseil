"use client";

import { User } from "lucide-react";
import type { NavDropdownId } from "@/lib/content/navigation";
import {
  NAV_ACCOUNT,
  NAV_CONTACT,
  NAV_CONSEILS,
  NAV_PRIMARY_CTA,
  ROUTES,
} from "@/lib/content/navigation";
import { NavDropdown } from "@/components/layout/navbar/nav-dropdown";
import {
  NavHamburger,
  NavIconButton,
  NavPrimaryButton,
  NavTextLink,
} from "@/components/layout/navbar/nav-buttons";
import { ContactGlassLink } from "@/components/ui/contact-glass-link";
import { NavLogo } from "@/components/layout/navbar/nav-logo";

export type NavContentProps = {
  light: boolean;
  dropdownSurfaceClass: string;
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
  desktopOpen: NavDropdownId | null;
  setDesktopOpen: React.Dispatch<React.SetStateAction<NavDropdownId | null>>;
  onAccountClick?: () => void;
};

export function NavContent({
  light,
  dropdownSurfaceClass,
  mobileOpen,
  setMobileOpen,
  desktopOpen,
  setDesktopOpen,
  onAccountClick,
}: NavContentProps) {
  return (
    <nav className="flex min-h-[56px] items-center gap-2 px-2.5 sm:min-h-[60px] sm:gap-2.5 sm:px-3 lg:min-h-[64px] lg:gap-3 lg:px-4 xl:px-4">
      <NavLogo light={light} />

      <div className="hidden items-center gap-1 lg:flex">
        <NavTextLink href={ROUTES.home} light={light}>
          Accueil
        </NavTextLink>
        <NavDropdown
          id="cabinet"
          light={light}
          surfaceClass={dropdownSurfaceClass}
          open={desktopOpen}
          setOpen={setDesktopOpen}
        />
        <NavDropdown
          id="expertises"
          light={light}
          surfaceClass={dropdownSurfaceClass}
          open={desktopOpen}
          setOpen={setDesktopOpen}
        />
        <NavTextLink href={NAV_CONSEILS.href} light={light}>
          {NAV_CONSEILS.label}
        </NavTextLink>
      </div>

      <div className="ml-auto hidden items-center gap-2 lg:flex xl:gap-2.5">
        <NavPrimaryButton href={NAV_PRIMARY_CTA.href}>{NAV_PRIMARY_CTA.label}</NavPrimaryButton>
        <ContactGlassLink href={NAV_CONTACT.href} light={light} layout="nav" />
        <NavIconButton
          light={light}
          href={onAccountClick ? undefined : NAV_ACCOUNT.href}
          onClick={onAccountClick}
          ariaLabel="Compte : connexion ou inscription"
        >
          <User className="h-5 w-5" />
        </NavIconButton>
      </div>

      <div className="ml-auto flex items-center gap-1.5 lg:hidden">
        <ContactGlassLink
          href={NAV_CONTACT.href}
          light={light}
          layout="nav"
          className="px-3 sm:px-4 xl:h-10 xl:px-4 xl:text-[13px]"
        />
        <NavIconButton
          light={light}
          href={onAccountClick ? undefined : NAV_ACCOUNT.href}
          onClick={onAccountClick}
          ariaLabel="Compte : connexion ou inscription"
        >
          <User className="h-[18px] w-[18px]" />
        </NavIconButton>
        <NavIconButton
          light={light}
          ariaLabel={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setMobileOpen((value) => !value)}
        >
          <NavHamburger open={mobileOpen} />
        </NavIconButton>
      </div>
    </nav>
  );
}
