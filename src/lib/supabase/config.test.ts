import { describe, expect, it } from "vitest";
import {
  SUPABASE_PROJECT_REF,
  SUPABASE_PRODUCTION_URL,
  assertProductionSupabaseUrl,
  supabaseRefFromUrl,
} from "@/lib/supabase/config";

describe("supabase config", () => {
  it("extrait la ref projet", () => {
    expect(supabaseRefFromUrl("https://gyisrwfapphqqdbpujtb.supabase.co")).toBe(SUPABASE_PROJECT_REF);
  });

  it("accepte l’URL prod attendue", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    expect(() => assertProductionSupabaseUrl(SUPABASE_PRODUCTION_URL)).not.toThrow();
    process.env.NODE_ENV = prev;
  });

  it("refuse une autre ref en production", () => {
    const prev = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    expect(() => assertProductionSupabaseUrl("https://wrongref.supabase.co")).toThrow(/gyisrwfapphqqdbpujtb/);
    process.env.NODE_ENV = prev;
  });
});
