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

  it("synchronise les champs quand le client portail change", () => {
    const nextClient: PortalClient = {
      ...baseClient,
      phone: "0752052934",
      address: "21 rue rem",
      updatedAtIso: "2026-05-22T13:00:00.001Z",
    };

    const { rerender } = render(<ClientProfileForm client={baseClient} />);
    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("");

    rerender(<ClientProfileForm client={nextClient} />);

    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("0752052934");
  });

  it("applique la réponse RPC au store et au formulaire", async () => {
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

    render(<ClientProfileForm client={baseClient} />);

    const companyInput = screen.getByRole("textbox", { name: /entreprise/i });
    await user.clear(companyInput);
    await user.type(companyInput, "Nouvelle SA");
    await user.click(screen.getByRole("button", { name: /enregistrer/i }));

    expect(saveClientProfile).toHaveBeenCalled();
    expect(patchClient).toHaveBeenCalledWith(
      "client-1",
      expect.objectContaining({ companyName: "Nouvelle SA", phone: "0700000000" }),
    );
    expect(await screen.findByText("Profil enregistré.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /téléphone/i })).toHaveValue("0700000000");
  });
});
