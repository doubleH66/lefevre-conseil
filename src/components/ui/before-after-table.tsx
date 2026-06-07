import { cn } from "@/lib/utils";
import type { ComparisonTableData } from "@/components/ui/comparison-table";
import { ServiceRichText } from "@/components/services/service-rich-text";

/** Tableau deux colonnes Avant / Après (pages services). */
export function BeforeAfterTable({ data, className }: { data: ComparisonTableData; className?: string }) {
  const [colBefore, colAfter] =
    data.columns.length >= 2 ? [data.columns[0], data.columns[1]] : ["Avant", "Après"];

  return (
    <div className={cn("overflow-x-auto", className)}>
      <p className="mb-3 text-center text-[13px] font-semibold text-[#1f2a7c]/70">{data.title}</p>
      <table className="w-full min-w-[20rem] border-collapse overflow-hidden rounded-2xl border border-[#1f2a7c]/12 text-sm shadow-[0_16px_48px_-32px_rgba(31,42,124,0.18)]">
        <thead>
          <tr>
            <th className="w-[28%] border-b border-[#1f2a7c]/10 bg-[#f5f6fa] px-4 py-3.5 text-left text-[12px] font-semibold text-[#1f2a7c]/55 sm:px-5">
              &nbsp;
            </th>
            <th className="border-b border-[#1f2a7c]/10 bg-[#eef0f6] px-4 py-3.5 text-center text-[13px] font-semibold text-[#1f2a7c]/70 sm:px-5">
              {colBefore}
            </th>
            <th className="border-b border-white/15 bg-[#1f2a7c] px-4 py-3.5 text-center text-[13px] font-semibold text-white sm:px-5">
              {colAfter}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr key={row.label} className={ri % 2 === 0 ? "bg-white" : "bg-[#fafbfc]"}>
              <td className="border-t border-[#1f2a7c]/08 px-4 py-3.5 text-[12px] font-semibold text-[#1f2a7c]/65 sm:px-5">
                {row.label}
              </td>
              <td className="border-t border-[#1f2a7c]/08 px-4 py-3.5 text-center text-[13px] leading-relaxed text-[#1f2a7c]/72 sm:px-5">
                <ServiceRichText as="span">{row.cells[0] ?? "---"}</ServiceRichText>
              </td>
              <td className="border-t border-[#1f2a7c]/08 bg-[#1f2a7c]/[0.03] px-4 py-3.5 text-center text-[13px] leading-relaxed text-[#1f2a7c] sm:px-5">
                <ServiceRichText as="span">{row.cells[1] ?? "---"}</ServiceRichText>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
