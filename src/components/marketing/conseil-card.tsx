"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import { hubCardClass } from "@/components/marketing/hub-styles";
import { SearchHighlight } from "@/components/ui/search-highlight";
import type { Article } from "@/lib/content/articles";
import { articleHref } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

type ConseilCardProps = {
  article: Article;
  searchTerm?: string;
  published?: boolean;
};

export function ConseilCard({ article, searchTerm = "", published = true }: ConseilCardProps) {
  const q = searchTerm.trim();
  const readMinutes = article.readTime.replace(/\s*min.*/i, "").trim() || article.readTime;

  const inner = (
    <>
      <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover transition duration-500 group-hover/card:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>

      <div className="flex flex-1 flex-col px-3.5 py-3 md:px-4 md:py-3.5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-medium text-zinc-500">
            {q ? <SearchHighlight text={article.category} query={searchTerm} /> : article.category}
          </p>
          <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-zinc-400">
            <Clock className="size-3" aria-hidden />
            {readMinutes} min
          </span>
        </div>

        <h2 className="mt-0.5 line-clamp-2 text-sm font-medium leading-snug text-zinc-900 transition group-hover/card:text-zinc-700">
          {q ? <SearchHighlight text={article.title} query={searchTerm} /> : article.title}
        </h2>

        <p className="mt-2 line-clamp-2 flex-1 text-xs leading-6 text-zinc-600">
          {q ? <SearchHighlight text={article.excerpt} query={searchTerm} /> : article.excerpt}
        </p>

        <div className="mt-3 flex items-center justify-between gap-3 border-t border-zinc-100 pt-3">
          <time className="text-[11px] text-zinc-500">{article.date}</time>
          <span
            className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-zinc-900 transition group-hover/card:gap-1"
            aria-hidden
          >
            {published ? "Lire" : "Bientôt"}
            {published ? <ArrowUpRight className="size-3.5" /> : null}
          </span>
        </div>
      </div>
    </>
  );

  if (!published) {
    return <article className={cn(hubCardClass, "opacity-95")}>{inner}</article>;
  }

  return (
    <article className={hubCardClass}>
      <Link href={articleHref(article.slug)} className="flex h-full flex-col">
        {inner}
      </Link>
    </article>
  );
}
