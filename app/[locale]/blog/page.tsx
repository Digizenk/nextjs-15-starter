import { BlogCard } from "@/app/[locale]/blog/BlogCard";
import { Locale, LOCALES } from "@/i18n/routing";
import { getPosts } from "@/lib/getBlogs";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SignupForm } from "@/components/SignupForm";

type Params = Promise<{ locale: string }>;

type MetadataProps = {
  params: Params;
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });

  return constructMetadata({
    page: "Blog",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: `/blog`,
    canonicalUrl: `/blog`,
  });
}

export default async function Page({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { posts } = await getPosts(locale);
  const t = await getTranslations("Blog");
  const tHome = await getTranslations("Home.guides");

  return (
    <section className="mx-auto w-full max-w-3xl px-4 pt-14 pb-20 sm:px-6">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted-foreground">{t("description")}</p>

      {posts.length > 0 ? (
        <div className="mt-10 border-b border-border">
          {posts.map((post) => (
            <BlogCard key={post.slug} locale={locale} post={post} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-lg border border-dashed border-input p-6 sm:p-8">
          <p className="max-w-md leading-relaxed">{tHome("empty")}</p>
          <SignupForm className="mt-5" />
        </div>
      )}
    </section>
  );
}

export async function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
