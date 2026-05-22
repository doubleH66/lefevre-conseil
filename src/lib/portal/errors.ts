/** Message lisible pour les erreurs Supabase / portail. */
export function formatPortalError(error: unknown): string {
  if (!error) return "Une erreur est survenue.";

  const msg =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: string }).message)
      : error instanceof Error
        ? error.message
        : String(error);

  const lower = msg.toLowerCase();

  if (lower.includes("bucket not found") || lower.includes("portal-documents")) {
    return "Le stockage des pièces (bucket portal-documents) n'est pas configuré. Exécutez les migrations 003 et 009 dans Supabase.";
  }

  if (lower.includes("mime") || lower.includes("invalid_request")) {
    return "Format de fichier refusé. Utilisez un PDF, une image ou un document Word.";
  }

  if (
    lower.includes("row-level security") ||
    lower.includes("permission denied") ||
    lower.includes("42501") ||
    lower.includes("403")
  ) {
    return "Droits insuffisants. Vérifiez que les migrations 003 à 005 sont appliquées et que votre compte est bien lié au client (même e-mail).";
  }

  if (lower.includes("invalid input syntax for type uuid")) {
    return "Référence dossier invalide. Réessayez sans dossier associé ou contactez le cabinet.";
  }

  if (lower.includes("not_authenticated") || lower.includes("jwt")) {
    return "Session expirée. Reconnectez-vous.";
  }

  return msg.length > 280 ? `${msg.slice(0, 277)}…` : msg;
}
