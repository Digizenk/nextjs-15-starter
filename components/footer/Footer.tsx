import { Logo } from "@/components/Logo";
import { SignupForm } from "@/components/SignupForm";
import { siteConfig } from "@/config/site";
import { Link as I18nLink } from "@/i18n/routing";
import { FooterLink } from "@/types/common";
import { MailIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { SiFacebook, SiInstagram, SiTiktok, SiYoutube } from "react-icons/si";

const SOCIALS = [
  { key: "youtube", label: "YouTube", Icon: SiYoutube },
  { key: "tiktok", label: "TikTok", Icon: SiTiktok },
  { key: "instagram", label: "Instagram", Icon: SiInstagram },
  { key: "facebook", label: "Facebook", Icon: SiFacebook },
] as const;

export default async function Footer() {
  const t = await getTranslations("Home");
  const tFooter = await getTranslations("Footer");
  const footerLinks: FooterLink[] = tFooter.raw("Links.groups");
  const links = siteConfig.socialLinks ?? {};

  return (
    <footer className="bg-[#1B1F3B] text-white/80 dark:bg-[#0D0F1F]">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Logo className="text-white" />
            <p className="mt-3 max-w-sm text-sm leading-relaxed">{t("tagLine")}</p>

            <h2 className="mt-8 font-display text-lg font-semibold text-white">
              {tFooter("Newsletter.title")}
            </h2>
            <p className="mt-1 text-sm">{tFooter("Newsletter.description")}</p>
            <SignupForm tone="inverse" className="mt-4" />

            <div className="mt-2 flex items-center gap-1">
              {SOCIALS.map(({ key, label, Icon }) =>
                links[key] ? (
                  <Link
                    key={key}
                    href={links[key]!}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 hover:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                ) : null
              )}
              {links.email && (
                <Link
                  href={`mailto:${links.email}`}
                  aria-label="Email"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-white/10 hover:text-white"
                >
                  <MailIcon className="h-4 w-4" aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>

          {footerLinks.map((section) => (
            <nav key={section.title} aria-label={section.title}>
              <h2 className="font-display text-base font-semibold text-white">{section.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.useA ? (
                      <a href={link.href} className="hover:text-white">
                        {link.name}
                      </a>
                    ) : (
                      <I18nLink href={link.href} prefetch={false} className="hover:text-white">
                        {link.name}
                      </I18nLink>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 py-6 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
          <p>
            {tFooter("Copyright", {
              year: new Date().getFullYear(),
              name: siteConfig.name,
            })}
          </p>
          <div className="flex gap-6">
            <I18nLink href="/privacy-policy" prefetch={false} className="hover:text-white">
              {tFooter("PrivacyPolicy")}
            </I18nLink>
            <I18nLink href="/terms-of-service" prefetch={false} className="hover:text-white">
              {tFooter("TermsOfService")}
            </I18nLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
