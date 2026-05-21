import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function AdminTable({
  headers,
  rows,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <div className="hidden md:block">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50/90">
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={`row-${i}`} className={cn("border-b border-neutral-100", i === rows.length - 1 && "border-b-0")}>
                {row.map((cell, idx) => (
                  <td key={`cell-${i}-${idx}`} className="px-4 py-3 text-sm text-neutral-700">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {rows.map((row, i) => (
          <article key={`m-row-${i}`} className="rounded-xl border border-neutral-200 p-3">
            {row.map((cell, idx) => (
              <div key={`m-cell-${i}-${idx}`} className="mb-1.5 text-sm last:mb-0">
                <span className="mr-2 text-xs font-semibold uppercase tracking-[0.08em] text-neutral-500">{headers[idx]}:</span>
                <span className="text-neutral-700">{cell}</span>
              </div>
            ))}
          </article>
        ))}
      </div>
    </div>
  );
}
