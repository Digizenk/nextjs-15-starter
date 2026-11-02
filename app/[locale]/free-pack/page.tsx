import { SignupForm } from "@/components/SignupForm";
import { Locale, LOCALES } from "@/i18n/routing";
import { constructMetadata } from "@/lib/metadata";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Params = Promise<{ locale: string }>;
type Item = { title: string; body: string };

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FreePack" });
  return constructMetadata({
    page: "FreePack",
    title: t("title"),
    description: t("description"),
    locale: locale as Locale,
    path: "/free-pack",
    canonicalUrl: "/free-pack",
  });
}

export default async function FreePackPage({ params }: { params: Params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("FreePack");
  const items = t.raw("inside") as Item[];

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:px-8 lg:pt-20">
      <div>
        <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          {t("headline")}
        </h1>
        <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">{t("body")}</p>
        <SignupForm className="mt-8" />
        <p className="max-w-md text-sm text-muted-foreground">{t("privacy")}</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-semibold">{t("insideTitle")}</h2>
        <dl className="mt-4">
          {items.map((item) => (
            <div key={item.title} className="flex gap-4 border-t border-border py-4 first:border-t-0">
              <span className="mt-0.5 shrink-0 font-mono text-sm">
                <mark className="prompt-slot">×5</mark>
              </span>
              <div>
                <dt className="font-semibold">{item.title}</dt>
                <dd className="mt-0.5 leading-relaxed text-muted-foreground">{item.body}</dd>
              </div>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}
