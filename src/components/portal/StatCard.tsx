export function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: number | string;
  hint?: string;
}) {
  return (
    <article className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-5">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-neutral-900">{value}</p>
      {hint ? <p className="mt-1.5 text-xs text-neutral-500">{hint}</p> : null}
    </article>
  );
}

