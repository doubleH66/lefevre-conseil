"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { hubCardClass } from "@/components/marketing/hub-styles";
import { SearchHighlight } from "@/components/ui/search-highlight";
import { EXPERTISE_CAROUSEL_IMAGES, serviceDetailHref } from "@/lib/content/services";
import type { ServiceSlug } from "@/lib/content/services";
import { cn } from "@/lib/utils";

type ExpertiseHubCardProps = {
  slug: ServiceSlug;
  title: string;
  summary: string;
  searchTerm?: string;
};

export function ExpertiseHubCard({ slug, title, summary, searchTerm = "" }: ExpertiseHubCardProps) {
  const q = searchTerm.trim();
  const image = EXPERTISE_CAROUSEL_IMAGES[slug];

  return (
    <Link href={serviceDetailHref(slug)} className={cn(hubCardClass, "group")}>
      <div className="relative aspect-[4/3] overflow-hidden bg-zinc-100">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col px-3.5 py-3 md:px-4 md:py-3.5">
        <p className="text-[9px] font-medium uppercase tracking-[0.14em] text-zinc-500">Expertise</p>
        <h2 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-zinc-900 transition group-hover:text-zinc-700">
          {q ? <SearchHighlight text={title} query={searchTerm} /> : title}
        </h2>
        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-6 text-zinc-600">
          {q ? <SearchHighlight text={summary} query={searchTerm} /> : summary}
        </p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-900 transition group-hover:gap-2">
          Découvrir
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
