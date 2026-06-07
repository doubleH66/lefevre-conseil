"use client";

import { cn } from "@/lib/utils";
import { ServiceRichText } from "@/components/services/service-rich-text";

export type ComparisonTableData = {
  title: string;
  columns: string[];
  rows: { label: string; cells: string[] }[];
};

export function ComparisonTable({ data, className }: { data: ComparisonTableData; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <p className="mb-3 text-[13px] font-semibold text-[#1f2a7c]/70">{data.title}</p>
      <table className="w-full min-w-[28rem] border-collapse overflow-hidden rounded-2xl border border-[#1f2a7c]/10 text-sm">
        <thead>
          <tr className="bg-[#1f2a7c]">
            <th className="px-4 py-3 text-left text-[12px] font-semibold tracking-wide text-white/70 sm:px-5">
              &nbsp;
            </th>
            {data.columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-center text-[12px] font-semibold tracking-wide text-white sm:px-5"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, ri) => (
            <tr
              key={row.label}
              className={ri % 2 === 0 ? "bg-white" : "bg-[#1f2a7c]/[0.025]"}
            >
              <td className="border-t border-[#1f2a7c]/08 px-4 py-3 text-[12px] font-semibold text-[#1f2a7c]/60 sm:px-5">
                {row.label}
              </td>
              {row.cells.map((cell, ci) => (
                <td
                  key={ci}
                  className="border-t border-[#1f2a7c]/08 px-4 py-3 text-center text-[13px] leading-snug text-[#1f2a7c]/80 sm:px-5"
                >
                  <ServiceRichText as="span">{cell}</ServiceRichText>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
