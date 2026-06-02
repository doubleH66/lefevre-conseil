import { requireSupabasePublicEnv } from "@/lib/supabase/public-env";

export async function sendMutuelleNotification(payload: {
  to: string | string[];
  subject: string;
  text: string;
  clientName?: string;
}): Promise<void> {
  const { url, anonKey } = requireSupabasePublicEnv();
  const res = await fetch(`${url}/functions/v1/portal-notify`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${anonKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    console.warn("portal-notify mutuelle:", await res.text());
  }
}
