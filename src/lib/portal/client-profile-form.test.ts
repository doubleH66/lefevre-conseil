import { describe, expect, it } from "vitest";
import { fieldsToFormData, parseClientProfileFormData } from "@/lib/portal/client-profile-form";

describe("parseClientProfileFormData", () => {
  it("accepte des champs valides", () => {
    const fd = fieldsToFormData({
      companyName: "Lefèvre",
      contactName: "Philippe",
      phone: "04 68 86 36 22",
      address: "Perpignan",
      website: "https://example.com",
    });
    expect(parseClientProfileFormData(fd)).toEqual({
      companyName: "Lefèvre",
      contactName: "Philippe",
      phone: "04 68 86 36 22",
      address: "Perpignan",
      website: "https://example.com",
    });
  });

  it("refuse entreprise ou contact vide", () => {
    const fd = new FormData();
    fd.set("companyName", " ");
    fd.set("contactName", "Test");
    expect(parseClientProfileFormData(fd)).toEqual({
      error: "Entreprise et contact sont obligatoires.",
    });
  });
});
