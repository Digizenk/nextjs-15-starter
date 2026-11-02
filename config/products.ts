/**
 * Product catalog shown on the Home and Shop pages.
 *
 * To connect a product to its real listing, paste the URL into `links.etsy`
 * (shown to English visitors) and/or `links.hotmart` (shown to Spanish
 * visitors). If a visitor's preferred store has no link, the other store is
 * used. A product with no links at all shows "Link coming soon".
 */

export type Store = "etsy" | "hotmart";

export type Product = {
  id: string;
  category: "prompts" | "content" | "art" | "planners" | "food";
  featured?: boolean;
  links: Partial<Record<Store, string>>;
  en: { name: string; description: string };
  es: { name: string; description: string };
};

export const products: Product[] = [
  {
    id: "real-estate-prompts",
    category: "prompts",
    featured: true,
    links: { etsy: "", hotmart: "" },
    en: {
      name: "100 ChatGPT Prompts for Real Estate Agents",
      description:
        "Listings, follow-ups, open house posts and client emails. Paste, fill in the details, done.",
    },
    es: {
      name: "100 prompts de ChatGPT para agentes inmobiliarios",
      description:
        "Anuncios, seguimientos, publicaciones de casa abierta y correos a clientes. Pega, completa los datos y listo.",
    },
  },
  {
    id: "etsy-shop-prompts",
    category: "prompts",
    featured: true,
    links: { etsy: "", hotmart: "" },
    en: {
      name: "100 ChatGPT Prompts for Etsy Shop Success",
      description:
        "Titles, tags, descriptions and shop announcements written for how Etsy search actually works.",
    },
    es: {
      name: "100 prompts de ChatGPT para triunfar en Etsy",
      description:
        "Títulos, etiquetas, descripciones y anuncios de tienda pensados para el buscador de Etsy.",
    },
  },
  {
    id: "faceless-vault",
    category: "content",
    featured: true,
    links: { etsy: "", hotmart: "" },
    en: {
      name: "The Faceless Vault",
      description:
        "160+ AI video prompts across 10 faceless content niches, with thumbnail and SEO prompts included.",
    },
    es: {
      name: "The Faceless Vault",
      description:
        "Más de 160 prompts de video con IA en 10 nichos de contenido sin mostrar la cara, con prompts para miniaturas y SEO.",
    },
  },
  {
    id: "frame-tv-art",
    category: "art",
    links: { etsy: "", hotmart: "" },
    en: {
      name: "Samsung Frame TV Art",
      description: "Artwork sized and exported for the Frame TV, ready to upload from your phone.",
    },
    es: {
      name: "Arte para Samsung Frame TV",
      description: "Obras con el tamaño y formato exactos para la Frame TV, listas para subir desde tu teléfono.",
    },
  },
  {
    id: "vintage-botanicals",
    category: "art",
    links: { etsy: "", hotmart: "" },
    en: {
      name: "Vintage Botanical Print Bundles",
      description: "Printable botanical art sets in matching palettes for gallery walls.",
    },
    es: {
      name: "Colecciones de láminas botánicas vintage",
      description: "Sets de arte botánico imprimible en paletas a juego para paredes de galería.",
    },
  },
  {
    id: "social-media-planners",
    category: "planners",
    links: { etsy: "", hotmart: "" },
    en: {
      name: "Social Media Planners",
      description: "Monthly content planners to map posts, captions and launch dates in one place.",
    },
    es: {
      name: "Planificadores de redes sociales",
      description: "Planificadores mensuales para organizar publicaciones, textos y lanzamientos en un solo lugar.",
    },
  },
  {
    id: "recipe-mega-bundle",
    category: "food",
    links: { etsy: "", hotmart: "" },
    en: {
      name: "1000+ Recipe Mega Bundle",
      description: "A printable recipe library for meal planning, organized by meal and ingredient.",
    },
    es: {
      name: "Mega paquete de más de 1000 recetas",
      description: "Una biblioteca de recetas imprimibles para planificar comidas, organizada por tipo y por ingrediente.",
    },
  },
];

const PREFERRED_STORE: Record<string, Store> = { en: "etsy", es: "hotmart" };

/** Picks the right store link for a visitor's language. */
export function getProductLink(product: Product, locale: string): { url: string; store: Store } | null {
  const preferred = PREFERRED_STORE[locale] ?? "etsy";
  const fallback: Store = preferred === "etsy" ? "hotmart" : "etsy";
  if (product.links[preferred]) return { url: product.links[preferred]!, store: preferred };
  if (product.links[fallback]) return { url: product.links[fallback]!, store: fallback };
  return null;
}

export function getProductText(product: Product, locale: string) {
  return locale === "es" ? product.es : product.en;
}
