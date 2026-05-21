import { StatusBadge } from "@/components/portal/StatusBadge";

export function DocumentRequestCard({
  title,
  description,
  dueDate,
  importance,
}: {
  title: string;
  description: string;
  dueDate: string;
  importance: "Normal" | "Important" | "Urgent";
}) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-neutral-900">{title}</p>
        <StatusBadge status={importance} />
      </div>
      <p className="mt-2 text-sm text-neutral-600">{description}</p>
      <p className="mt-2 text-xs text-neutral-500">Date limite : {dueDate}</p>
    </article>
  );
}

