import { getProductLink, getProductText, Product } from "@/config/products";
import { ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function ProductList({ products, locale }: { products: Product[]; locale: string }) {
  const t = await getTranslations("Product");

  return (
    <ul className="grid border-b border-border md:grid-cols-2 md:gap-x-10">
      {products.map((product) => {
        const text = getProductText(product, locale);
        const link = getProductLink(product, locale);
        return (
          <li key={product.id} className="flex flex-col border-t border-border py-6">
            <h3 className="font-display text-lg font-semibold leading-snug tracking-tight">{text.name}</h3>
            <p className="mt-1.5 flex-1 leading-relaxed text-muted-foreground">{text.description}</p>
            <div className="mt-4">
              {link ? (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-sm font-semibold text-primary underline-offset-4 hover:underline"
                >
                  {t("buyOn", { store: t(`stores.${link.store}`) })}
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              ) : (
                <span className="text-sm text-muted-foreground">{t("comingSoon")}</span>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
