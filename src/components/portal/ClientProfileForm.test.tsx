import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientProfileForm } from "@/components/portal/ClientProfileForm";
import type { PortalClient } from "@/components/portal/types";

const patchClient = vi.fn();
const saveClientProfile = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({}),
}));

vi.mock("@/lib/portal/save-client-profile", () => ({
  saveClientProfile: (...args: unknown[]) => saveClientProfile(...args),
}));

vi.mock("@/components/portal/portal-provider", () => ({
  usePortal: () => ({
    authUser: { id: "user-1", email: "test@example.com", fullName: "Test", avatarUrl: null },
    patchClient,
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
    patchClient.mockClear();
    saveClientProfile.mockReset();
  });

  it("affiche la fiche profil en lecture depuis le client portail", () => {
    const client: PortalClient = {
      ...baseClient,
      phone: "0752052934",
      address: "21 rue rem",
    };

    render(<ClientProfileForm client={client} />);

    expect(screen.getByText("Ancienne entreprise")).toBeInTheDocument();
    expect(screen.getByText("0752052934")).toBeInTheDocument();
    expect(screen.getByText("21 rue rem")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /modifier mes informations/i })).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: /entreprise/i })).not.toBeInTheDocument();
  });

  it("met à jour la fiche quand le client portail change", () => {
    const nextClient: PortalClient = {
      ...baseClient,
      phone: "0752052934",
      address: "21 rue rem",
      updatedAtIso: "2026-05-22T13:00:00.001Z",
    };

    const { rerender } = render(<ClientProfileForm client={baseClient} />);
    expect(screen.queryByText("0752052934")).not.toBeInTheDocument();

    rerender(<ClientProfileForm client={nextClient} />);

    expect(screen.getByText("0752052934")).toBeInTheDocument();
    expect(screen.getByText("21 rue rem")).toBeInTheDocument();
  });

  it("enregistre via RPC, met à jour le store et revient en mode lecture", async () => {
    const user = userEvent.setup();
    saveClientProfile.mockResolvedValue({
      ok: true,
      saved: {
        id: "client-1",
        companyName: "Nouvelle SA",
        contactName: "Jean Dupont",
        email: "test@example.com",
        phone: "0700000000",
        address: "21 rue test",
        website: "",
        lastActivity: "22/05/2026 15:00",
        updatedAtIso: "2026-05-22T14:00:00.000Z",
      },
    });

    const { rerender } = render(<ClientProfileForm client={baseClient} />);

    await user.click(screen.getByRole("button", { name: /modifier mes informations/i }));

    const companyInput = screen.getByRole("textbox", { name: /entreprise/i });
    await user.clear(companyInput);
    await user.type(companyInput, "Nouvelle SA");
    await user.click(screen.getByRole("button", { name: /^enregistrer$/i }));

    expect(saveClientProfile).toHaveBeenCalled();
    expect(patchClient).toHaveBeenCalledWith(
      "client-1",
      expect.objectContaining({ companyName: "Nouvelle SA", phone: "0700000000" }),
    );

    expect(await screen.findByText("Profil enregistré.")).toBeInTheDocument();
    expect(screen.queryByRole("textbox", { name: /entreprise/i })).not.toBeInTheDocument();

    rerender(
      <ClientProfileForm
        client={{
          ...baseClient,
          companyName: "Nouvelle SA",
          contactName: "Jean Dupont",
          phone: "0700000000",
          address: "21 rue test",
          updatedAtIso: "2026-05-22T14:00:00.000Z",
        }}
      />,
    );

    expect(screen.getByText("Nouvelle SA")).toBeInTheDocument();
    expect(screen.getByText("0700000000")).toBeInTheDocument();
  });

  it("annule l’édition sans perdre les valeurs affichées", async () => {
    const user = userEvent.setup();
    const client: PortalClient = {
      ...baseClient,
      phone: "0752052934",
      address: "21 rue rem",
    };

    render(<ClientProfileForm client={client} />);

    await user.click(screen.getByRole("button", { name: /modifier mes informations/i }));
    const phoneInput = screen.getByRole("textbox", { name: /téléphone/i });
    await user.clear(phoneInput);
    await user.type(phoneInput, "0000000000");
    await user.click(screen.getByRole("button", { name: /annuler/i }));

    expect(screen.queryByRole("textbox", { name: /téléphone/i })).not.toBeInTheDocument();
    expect(screen.getByText("0752052934")).toBeInTheDocument();
    expect(screen.getByText("21 rue rem")).toBeInTheDocument();
  });
});
