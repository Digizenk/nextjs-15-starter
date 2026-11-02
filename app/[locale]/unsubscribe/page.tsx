import { unsubscribeFromNewsletter } from "@/actions/newsletter";
import { Link as I18nLink } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const metadata = { robots: { index: false, follow: false } };

export default async function UnsubscribePage({ params, searchParams }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Unsubscribe");
  const tHeader = await getTranslations("Header");

  const token = (await searchParams).token;
  const result =
    typeof token === "string" && token
      ? await unsubscribeFromNewsletter(token)
      : ({ success: false, reason: "missing" } as const);

  const errorKey =
    !result.success &&
    (result.reason === "missing"
      ? "missingToken"
      : result.reason === "invalid_token"
        ? "invalidToken"
        : "genericError");

  return (
    <section className="mx-auto w-full max-w-lg px-4 py-20">
      <p className="text-sm font-medium text-muted-foreground">{t("title")}</p>
      {result.success ? (
        <>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
            {t("successTitle")}
          </h1>
          <p className="mt-4 leading-relaxed">{t("successBody", { email: result.email })}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            {t("resubscribe")}{" "}
            <I18nLink href="/free-pack" className="font-medium text-primary underline underline-offset-4">
              {tHeader("cta")}
            </I18nLink>
          </p>
        </>
      ) : (
        <>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">{t("errorTitle")}</h1>
          <p className="mt-4 leading-relaxed">{t(errorKey as string)}</p>
          <p className="mt-4 leading-relaxed text-muted-foreground">{t("contact")}</p>
        </>
      )}
    </section>
  );
}
