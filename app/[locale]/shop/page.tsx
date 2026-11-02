import { ProductList } from "@/components/ProductList";
import { Product, products } from "@/config/products";
import { Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Params = Promise<{ locale: string }>;

const CATEGORY_ORDER: Product["category"][] = ["prompts", "content", "art", "planners", "food"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Shop" });
  return constructMetadata({
    page: "Shop",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: "/shop",
    canonicalUrl: "/shop",
  });
}

export default async function ShopPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Shop");

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-14 pb-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{t("intro")}</p>

      {CATEGORY_ORDER.map((category) => {
        const items = products.filter((p) => p.category === category);
        if (items.length === 0) return null;
        return (
          <div key={category} className="mt-14">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
              {t(`categories.${category}`)}
            </h2>
            <div className="mt-4">
              <ProductList products={items} locale={locale} />
            </div>
          </div>
        );
      })}
    </section>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
