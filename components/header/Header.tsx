import HeaderLinks from "@/components/header/HeaderLinks";
import MobileMenu from "@/components/header/MobileMenu";
import LocaleSwitcher from "@/components/LocaleSwitcher";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { Link as I18nLink } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const Header = () => {
  const t = useTranslations("Header");

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <I18nLink href="/" prefetch={false} aria-label="Digizenk home" className="rounded-md">
            <Logo />
          </I18nLink>
          <HeaderLinks />
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <LocaleSwitcher />
          <ThemeToggle />
          <I18nLink
            href="/free-pack"
            className={cn(buttonVariants(), "ml-2 h-10 px-4 font-semibold")}
          >
            {t("cta")}
          </I18nLink>
        </div>

        <MobileMenu />
      </nav>
    </header>
  );
};

export default Header;
