import { describe, expect, it, vi, beforeEach } from "vitest";
import { saveClientProfile } from "@/lib/portal/save-client-profile";
import { fieldsToFormData } from "@/lib/portal/client-profile-form";

function createSupabaseMock(overrides: {
  user?: { id: string } | null;
  rpcRows?: Record<string, unknown> | null;
  rpcError?: { message: string } | null;
  profileError?: { message: string } | null;
}) {
  const user = "user" in overrides ? overrides.user : { id: "user-1" };
  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user } }),
    },
    rpc: vi.fn().mockResolvedValue({
      data: overrides.rpcRows === undefined ? [{ company_name: "Co", contact_name: "Nom", phone: "06", address: "Adr", website: null }] : overrides.rpcRows,
      error: overrides.rpcError ?? null,
    }),
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn().mockResolvedValue({ error: overrides.profileError ?? null }),
      })),
    })),
  };
}

describe("saveClientProfile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renvoie les données réellement enregistrées par la RPC", async () => {
    const supabase = createSupabaseMock({
      rpcRows: {
        company_name: "Société X",
        contact_name: "Paul",
        phone: "0611111111",
        address: "10 rue A",
        website: "https://x.fr",
      },
    });

    const fd = fieldsToFormData({
      companyName: "Société X",
      contactName: "Paul",
      phone: "0611111111",
      address: "10 rue A",
      website: "https://x.fr",
    });

    const result = await saveClientProfile(supabase as never, fd);
    expect(result).toEqual({
      ok: true,
      profile: {
        companyName: "Société X",
        contactName: "Paul",
        phone: "0611111111",
        address: "10 rue A",
        website: "https://x.fr",
      },
    });
    expect(supabase.rpc).toHaveBeenCalledWith("update_my_client_account", expect.any(Object));
  });

  it("échoue sans session", async () => {
    const supabase = createSupabaseMock({ user: null });
    const fd = fieldsToFormData({
      companyName: "A",
      contactName: "B",
      phone: "",
      address: "",
      website: "",
    });
    const result = await saveClientProfile(supabase as never, fd);
    expect(result).toEqual({ ok: false, error: "Session expirée. Reconnectez-vous." });
  });
});
