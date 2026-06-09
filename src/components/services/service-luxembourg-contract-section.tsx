import Link from "next/link";
import { ArrowUpRight, Check, Globe2, Layers, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LUXEMBOURG_CONTRACT_SECTION } from "@/lib/content/luxembourg-contract";
import { heroCtaPrimaryCompactClassName } from "@/lib/styles/cta";
import { cn } from "@/lib/utils";

const ADVANTAGE_ICONS: LucideIcon[] = [ShieldCheck, Layers, Globe2];

function AdvantageCard({
  icon: Icon,
  title,
  text,
}: {
  icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-[1.35rem] border border-[#1f2a7c]/10 bg-white/90 p-6 shadow-[0_14px_40px_rgba(23,33,59,0.05)] ring-1 ring-[#1f2a7c]/[0.04] sm:p-7">
      <span className="flex size-11 items-center justify-center rounded-2xl bg-[#1f2a7c]/[0.07] text-[#1f2a7c]">
        <Icon className="size-5" aria-hidden strokeWidth={1.85} />
      </span>
      <h3 className="mt-5 text-balance text-[1.0625rem] font-semibold leading-snug tracking-[-0.02em] text-[#1f2a7c] sm:text-lg">
        {title}
      </h3>
      <p className="mt-2.5 text-[14px] leading-relaxed text-[#1f2a7c]/72 sm:text-[15px]">{text}</p>
    </article>
  );
}

/** Section pédagogique — contrat d’assurance-vie luxembourgeois (page service). */
export function ServiceLuxembourgContractSection() {
  const { title, intro, advantages, audience, advisory, cta } = LUXEMBOURG_CONTRACT_SECTION;

  return (
    <section
      id="contrat-luxembourgeois"
      aria-labelledby="luxembourg-contract-title"
      className="scroll-mt-28"
    >
      <div className="rounded-[1.75rem] border border-[#1f2a7c]/8 bg-[#f8f6f1] p-6 sm:rounded-[2rem] sm:p-8 lg:rounded-[2.25rem] lg:p-10">
        <div className="mx-auto max-w-3xl text-center lg:max-w-4xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1f2a7c]/45">
            Enveloppe patrimoniale
          </p>
          <h2
            id="luxembourg-contract-title"
            className="mt-3 text-balance text-[clamp(1.35rem,3.2vw,2.125rem)] font-normal leading-[1.12] tracking-[-0.035em] text-[#1f2a7c]"
          >
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-[15px] leading-relaxed text-[#1f2a7c]/72 sm:mt-5 sm:text-base">
            {intro}
          </p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {advantages.map((item, index) => (
            <li key={item.title} className="min-w-0">
              <AdvantageCard icon={ADVANTAGE_ICONS[index]!} title={item.title} text={item.text} />
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-10 max-w-5xl sm:mt-12">
          <div className="rounded-[1.35rem] border border-[#1f2a7c]/10 bg-white/75 p-6 sm:p-8">
            <h3 className="text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1f2a7c]/45 sm:text-left">
              {audience.label}
            </h3>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-6 lg:gap-y-3.5">
              {audience.items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[14px] leading-snug text-[#1f2a7c]/80 sm:text-[15px]">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#1f2a7c]/[0.07] text-[#1f2a7c]"
                    aria-hidden
                  >
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside
          aria-label="Approche conseil"
          className="mx-auto mt-8 max-w-3xl rounded-[1.25rem] border border-[#1f2a7c]/12 bg-[#1f2a7c]/[0.04] px-5 py-5 sm:mt-10 sm:px-7 sm:py-6"
        >
          <p className="text-center text-[14px] leading-relaxed text-[#1f2a7c]/78 sm:text-[15px] sm:leading-relaxed">
            {advisory}
          </p>
        </aside>

        <div className="mt-8 flex justify-center sm:mt-10">
          <Link href={cta.href} className={cn(heroCtaPrimaryCompactClassName, "group gap-2 px-7 sm:min-w-[20rem]")}>
            {cta.label}
            <ArrowUpRight
              aria-hidden
              className="size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
