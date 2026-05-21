export function Timeline({
  items,
}: {
  items: { date: string; label: string; detail: string }[];
}) {
  return (
    <ol className="space-y-3">
      {items.map((item) => (
        <li key={`${item.date}-${item.label}`} className="relative rounded-xl border border-neutral-200 bg-white p-3 pl-4">
          <span className="absolute left-0 top-4 h-7 w-1 rounded-r bg-[#1f2a7c]" aria-hidden />
          <p className="text-xs font-semibold text-neutral-500">{item.date}</p>
          <p className="mt-0.5 text-sm font-semibold text-neutral-900">{item.label}</p>
          <p className="mt-1 text-sm text-neutral-600">{item.detail}</p>
        </li>
      ))}
    </ol>
  );
}

