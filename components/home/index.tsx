import { BlogCard } from "@/app/[locale]/blog/BlogCard";
import { PromptBuilder } from "@/components/home/PromptBuilder";
import { ProductList } from "@/components/ProductList";
import { buttonVariants } from "@/components/ui/button";
import { products } from "@/config/products";
import { Link as I18nLink } from "@/i18n/routing";
import { getPosts } from "@/lib/getBlogs";
import { cn } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

function SectionHeading({
  title,
  intro,
  href,
  linkLabel,
}: {
  title: string;
  intro: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-xl">
        <h2 className="font-display text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mt-2 leading-relaxed text-muted-foreground">{intro}</p>
      </div>
      <I18nLink
        href={href}
        className="shrink-0 font-semibold text-primary underline-offset-4 hover:underline"
      >
        {linkLabel}
      </I18nLink>
    </div>
  );
}

export default async function HomeComponent({ locale }: { locale: string }) {
  const t = await getTranslations("Home");
  const { posts } = await getPosts(locale);
  const featured = products.filter((p) => p.featured);

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-14 lg:px-8 lg:pt-20 lg:pb-24">
        <div>
          <h1 className="font-display text-[2.75rem] font-extrabold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[4.25rem]">
            {t("hero.headline")}
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            {t("hero.subhead")}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <I18nLink
              href="/free-pack"
              className={cn(buttonVariants({ size: "lg" }), "h-12 px-6 text-base font-semibold")}
            >
              {t("hero.primary")}
            </I18nLink>
            <I18nLink
              href="/shop"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "h-12 border-foreground/30 px-6 text-base font-semibold"
              )}
            >
              {t("hero.secondary")}
            </I18nLink>
          </div>
        </div>

        <PromptBuilder />
      </section>

      <section className="w-full border-t border-border bg-card/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title={t("products.title")}
            intro={t("products.intro")}
            href="/shop"
            linkLabel={t("products.all")}
          />
          <div className="mt-8">
            <ProductList products={featured} locale={locale} />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title={t("guides.title")}
          intro={t("guides.intro")}
          href="/blog"
          linkLabel={t("guides.all")}
        />
        {posts.length > 0 ? (
          <div className="mt-8 grid border-b border-border md:grid-cols-3 md:gap-x-10">
            {posts.slice(0, 3).map((post) => (
              <BlogCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg border border-dashed border-input p-6">
            <p className="max-w-lg leading-relaxed">{t("guides.empty")}</p>
            <I18nLink
              href="/free-pack"
              className="mt-3 inline-block font-semibold text-primary underline-offset-4 hover:underline"
            >
              {t("hero.primary")}
            </I18nLink>
          </div>
        )}
      </section>
    </>
  );
}
