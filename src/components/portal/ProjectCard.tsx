import { StatusBadge } from "@/components/portal/StatusBadge";
import type { PortalProject } from "@/components/portal/types";

export function ProjectCard({
  project,
  onDetail,
}: {
  project: PortalProject;
  onDetail: (id: string) => void;
}) {
  return (
    <article className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_10px_24px_rgba(10,20,40,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-neutral-900">{project.name}</h3>
          <p className="mt-1 text-sm text-neutral-600">{project.description}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between text-xs text-neutral-500">
          <span>Progression</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-2 rounded-full bg-neutral-100">
          <div className="h-2 rounded-full bg-[#1f2a7c]" style={{ width: `${project.progress}%` }} />
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-neutral-600">
        <p>Début : {project.startDate}</p>
        <p>Cible : {project.targetDate}</p>
        <p>Prochaine étape : {project.nextStep}</p>
        <p>Responsable : {project.owner}</p>
      </div>
      <button
        type="button"
        onClick={() => onDetail(project.id)}
        className="mt-4 rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
      >
        Voir le détail
      </button>
    </article>
  );
}

