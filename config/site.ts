import { SiteConfig } from "@/types/siteConfig";

// Set NEXT_PUBLIC_SITE_URL in .env once the domain is chosen.
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const siteConfig: SiteConfig = {
  name: "Digizenk",
  tagLine: "AI prompts and tools for small businesses",
  description:
    "Ready-to-use AI prompts, guides and free tools that save small business owners, Etsy sellers and creators hours every week.",
  url: BASE_URL,
  authors: [
    {
      name: "Digizenk",
      url: BASE_URL,
    },
  ],
  creator: "@digizenk",
  // Add profile links here when they're ready. Empty links are hidden.
  socialLinks: {
    youtube: process.env.NEXT_PUBLIC_YOUTUBE_URL,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL,
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL,
  },
  themeColors: [
    { media: "(prefers-color-scheme: light)", color: "#F5F6FA" },
    { media: "(prefers-color-scheme: dark)", color: "#121428" },
  ],
  defaultNextTheme: "system", // system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};
