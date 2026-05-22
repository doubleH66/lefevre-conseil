import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientProfileForm } from "@/components/portal/ClientProfileForm";
import type { PortalClient } from "@/components/portal/types";
import { profileFormRemountKey } from "@/lib/portal/profile-form-remount-key";

const refresh = vi.fn().mockResolvedValue(undefined);
const saveClientProfileAction = vi.fn();

vi.mock("@/app/espace-client/actions", () => ({
  saveClientProfileAction: (...args: unknown[]) => saveClientProfileAction(...args),
}));

vi.mock("@/components/portal/portal-provider", () => ({
  usePortal: () => ({
    authUser: { id: "user-1", email: "test@example.com", fullName: "Test", avatarUrl: null },
    refresh,
    updateAuthAvatar: vi.fn(),
    updateAuthFullName: vi.fn(),
  }),
}));

vi.mock("@/components/portal/ProfileAvatarField", () => ({
  ProfileAvatarField: () => <div data-testid="avatar-field" />,
}));

const baseClient: PortalClient = {
  id: "client-1",
  companyName: "Ancienne entreprise",
  contactName: "Ancien contact",
  email: "test@example.com",
  phone: "",
  address: "",
  website: "",
  status: "Actif",
  lastActivity: "01/01/2026",
  projectsCount: 0,
  pendingDocuments: 0,
  updatedAtIso: "2026-01-01T12:00:00.000Z",
};

describe("ClientProfileForm", () => {
  beforeEach(() => {
    refresh.mockClear();
    saveClientProfileAction.mockReset();
  });

  it("remonte le formulaire quand les données DB changent (nouvelle updatedAtIso)", () => {
    const nextClient: PortalClient = {
      ...baseClient,
      phone: "0752052934",
      address: "21 rue rem",
      lastActivity: "22/05/2026 14:00",
      updatedAtIso: "2026-05-22T13:00:00.001Z",
    };

    const { rerender } = render(
      <ClientProfileForm key={profileFormRemountKey(baseClient)} client={baseClient} />,
    );
    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("");

    rerender(<ClientProfileForm key={profileFormRemountKey(nextClient)} client={nextClient} />);

    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("0752052934");
    expect(screen.getByRole("textbox", { name: /adresse/i })).toHaveValue("21 rue rem");
  });

  it("appelle la Server Action puis refresh après enregistrement", async () => {
    const user = userEvent.setup();
    saveClientProfileAction.mockResolvedValue({
      id: "client-1",
      companyName: "Nouvelle SA",
      contactName: "Jean Dupont",
      email: "test@example.com",
      phone: "0700000000",
      address: "21 rue test",
      website: "",
      lastActivity: "22/05/2026 15:00",
      updatedAtIso: "2026-05-22T14:00:00.000Z",
    });

    render(<ClientProfileForm key={profileFormRemountKey(baseClient)} client={baseClient} />);

    const companyInput = screen.getByRole("textbox", { name: /entreprise/i });
    await user.clear(companyInput);
    await user.type(companyInput, "Nouvelle SA");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    expect(saveClientProfileAction).toHaveBeenCalledWith(
      expect.objectContaining({ companyName: "Nouvelle SA" }),
    );
    expect(await screen.findByText("Profil enregistré.")).toBeInTheDocument();
    expect(refresh).toHaveBeenCalledWith({ silent: true });
  });
});
