import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ClientProfileForm } from "@/components/portal/ClientProfileForm";
import type { PortalClient } from "@/components/portal/types";

const patchClient = vi.fn();
const updateClientProfile = vi.fn();
const createClient = vi.fn(() => ({
  from: () => ({
    update: () => ({
      eq: () => Promise.resolve({ error: null }),
    }),
  }),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => createClient(),
}));

vi.mock("@/lib/portal/update-client-profile", () => ({
  updateClientProfile: (...args: unknown[]) => updateClientProfile(...args),
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
};

describe("ClientProfileForm", () => {
  beforeEach(() => {
    patchClient.mockClear();
    updateClientProfile.mockReset();
  });

  it("recharge les champs après mise à jour serveur (F5 / refresh)", () => {
    const { rerender } = render(<ClientProfileForm client={baseClient} />);
    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("");

    rerender(
      <ClientProfileForm
        client={{
          ...baseClient,
          phone: "0752052934",
          address: "21 rue rem",
        }}
      />,
    );

    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("0752052934");
    expect(screen.getByRole("textbox", { name: /adresse/i })).toHaveValue("21 rue rem");
  });

  it("enregistre puis met à jour le store portail", async () => {
    const user = userEvent.setup();
    updateClientProfile.mockResolvedValue({
      id: "client-1",
      companyName: "Nouvelle SA",
      contactName: "Jean Dupont",
      email: "test@example.com",
      phone: "0700000000",
      address: "21 rue test",
      website: "",
    });

    render(<ClientProfileForm client={baseClient} />);

    await user.clear(screen.getByRole("textbox", { name: /entreprise/i }));
    await user.type(screen.getByRole("textbox", { name: /entreprise/i }), "Nouvelle SA");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    expect(updateClientProfile).toHaveBeenCalled();
    expect(await screen.findByText("Profil enregistré.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("0700000000");
    expect(patchClient).toHaveBeenCalled();
  });
});
