import * as React from "react";

/**
 * Rendu inline de markdown léger :
 *   **text**   → gras (font-semibold, couleur pleine)
 *   *text*     → italique
 *   __text__   → souligné
 *
 * Le composant hérite la couleur du parent ; le gras la force à pleine opacité.
 */
export function RichText({
  children,
  className,
  as: Tag = "p",
}: {
  children: string;
  className?: string;
  as?: "p" | "span" | "li" | "dd";
}) {
  const nodes = parseInline(children);
  return <Tag className={className}>{nodes}</Tag>;
}

function parseInline(text: string): React.ReactNode[] {
  /**
   * Ordre des alternatives (important) :
   * 1. \*\*bold\*\*   — doit passer avant \*italic\*
   * 2. __underline__
   * 3. \*italic\*
   */
  const pattern = /(\*\*(.+?)\*\*)|(__(.+?)__)|(\*(.+?)\*)/g;
  const result: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      result.push(text.slice(last, match.index));
    }

    if (match[1]) {
      // **bold** — poids semibold + couleur pleine pour ressortir sur fond atténué
      result.push(
        <strong key={key++} className="font-semibold text-[#1f2a7c]">
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      // __underline__ — même couleur que le contexte, juste soulignée
      result.push(
        <span key={key++} className="underline underline-offset-2 decoration-current/50">
          {match[4]}
        </span>,
      );
    } else if (match[5]) {
      // *italic* — style italique, léger effacement pour ne pas écraser le gras
      result.push(
        <em key={key++} className="italic not-[strong]:opacity-80">
          {match[6]}
        </em>,
      );
    }

    last = match.index + match[0].length;
  }

  if (last < text.length) {
    result.push(text.slice(last));
  }

  return result;
}
