import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar } from "lucide-react";
import { HOME_ARTICLES_TEASER } from "@/lib/content/articles";
import { CONSEILS_HREF, articleHref } from "@/lib/content/routes";
import { cn } from "@/lib/utils";

const defaultClassName = "mx-2.5 mb-12 lg:mx-4 lg:mb-16";

export function LatestConseilsSection({ className }: { className?: string }) {
  return (
    <section
      aria-labelledby="latest-conseils-title"
      className={cn(defaultClassName, className)}
    >
      <div className="rounded-3xl border border-neutral-200/80 bg-neutral-50 px-6 py-10 sm:px-10 sm:py-12 lg:px-14">
        <div className="flex flex-col gap-4 border-b border-neutral-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <h2
            id="latest-conseils-title"
            className="text-xl font-semibold tracking-tight text-[#1f2a7c] sm:text-2xl"
          >
            Nos derniers conseils
          </h2>
          <Link
            href={CONSEILS_HREF}
            className="inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-[#1f2a7c]/75 outline-none transition-colors hover:text-[#1f2a7c] focus-visible:ring-2 focus-visible:ring-[#1f2a7c]/25 focus-visible:ring-offset-2"
          >
            Tous les conseils
            <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
          </Link>
        </div>

        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {HOME_ARTICLES_TEASER.map((article) => (
            <li key={article.slug}>
              <Link
                href={articleHref(article.slug)}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1f2a7c]/5">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
                    {article.category}
                  </span>
                  <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/25 bg-black/35 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                    <BookOpen className="size-3" aria-hidden />
                    {article.readTime}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-[#1f2a7c]/45">
                    <Calendar className="size-3.5" aria-hidden />
                    {article.date}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-[15px] font-semibold leading-snug tracking-tight text-[#1f2a7c]">
                    {article.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1f2a7c]">
                    Lire l&apos;article
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
