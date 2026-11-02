"use client";

import { Link as I18nLink, usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { HeaderLink } from "@/types/common";
import { useTranslations } from "next-intl";

const HeaderLinks = () => {
  const tHeader = useTranslations("Header");
  const pathname = usePathname();
  const headerLinks: HeaderLink[] = tHeader.raw("links");

  return (
    <div className="hidden items-center gap-1 text-[15px] font-medium md:flex">
      {headerLinks.map((link) => {
        const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
        return (
          <I18nLink
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground",
              active && "text-foreground underline decoration-highlight decoration-[3px] underline-offset-8"
            )}
          >
            {link.name}
          </I18nLink>
        );
      })}
    </div>
  );
};

export default HeaderLinks;
