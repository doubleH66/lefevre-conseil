import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleDetailPage } from "@/components/pages/article-detail-page";
import { BreadcrumbJsonLd } from "@/components/seo/page-jsonld";
import { getArticleBySlug, getAllArticleSlugs } from "@/lib/content/articles";
import { ACTUALITES_HREF, articleHref } from "@/lib/content/routes";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return { title: "Article introuvable" };

  const path = articleHref(slug);
  return {
    title: `${article.title} | Lefèvre Conseil`,
    description: article.excerpt,
    alternates: { canonical: path },
    openGraph: { title: article.title, description: article.excerpt, url: path, type: "article" },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const path = articleHref(slug);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Accueil", path: "/" },
          { name: "Conseils", path: ACTUALITES_HREF },
          { name: article.category, path },
        ]}
      />
      <ArticleDetailPage article={article} />
    </>
  );
}
