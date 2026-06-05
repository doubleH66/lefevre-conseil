"use client";

import type { NavDropdownId } from "@/lib/content/navigation";
import {
  NAV_AVIS,
  NAV_CONTACT,
  NAV_CONSEILS,
  NAV_PRIMARY_CTA,
  ROUTES,
} from "@/lib/content/navigation";
import { FAQ_HREF } from "@/lib/content/routes";
import { NavAccountButton } from "@/components/layout/navbar/nav-account-button";
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
  onLoginClick?: () => void;
  onAccountMenuOpenChange?: (open: boolean) => void;
};

export function NavContent({
  light,
  dropdownSurfaceClass,
  mobileOpen,
  setMobileOpen,
  desktopOpen,
  setDesktopOpen,
  onLoginClick,
  onAccountMenuOpenChange,
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
        <NavTextLink href={NAV_AVIS.href} light={light}>
          {NAV_AVIS.label}
        </NavTextLink>
        <NavTextLink href={FAQ_HREF} light={light}>
          FAQ
        </NavTextLink>
      </div>

      <div className="ml-auto hidden items-center gap-2 lg:flex xl:gap-2.5">
        <NavPrimaryButton href={NAV_PRIMARY_CTA.href}>{NAV_PRIMARY_CTA.label}</NavPrimaryButton>
        <NavAccountButton
          light={light}
          surfaceClass={dropdownSurfaceClass}
          portalMenu
          onLoginClick={onLoginClick}
          onOpenChange={(open) => {
            onAccountMenuOpenChange?.(open);
            if (open) setDesktopOpen(null);
          }}
        />
      </div>

      <div className="ml-auto flex items-center gap-1.5 lg:hidden">
        <ContactGlassLink
          href={NAV_CONTACT.href}
          light={light}
          layout="nav"
          className="px-3 sm:px-4 xl:h-10 xl:px-4 xl:text-[13px]"
        />
        <NavAccountButton
          light={light}
          surfaceClass={dropdownSurfaceClass}
          compact
          onLoginClick={onLoginClick}
          onOpenChange={onAccountMenuOpenChange}
        />
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
