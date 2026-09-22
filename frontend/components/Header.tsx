"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  cookieName,
  languages,
  localeLabels,
  type Locale,
} from "@/lib/i18n/settings";
import { whatsappHref } from "@/lib/data";

type HeaderText = {
  banner: string;
  nav: {
    home: string;
    products: string;
    categories: string;
    about: string;
    contact: string;
  };
  chatWhatsapp: string;
  whatsappOpener: string;
  account: string;
  openMenu: string;
  closeMenu: string;
  language: string;
};

const NAV_PATHS: { key: keyof HeaderText["nav"]; path: string }[] = [
  { key: "home", path: "" },
  { key: "products", path: "/products" },
  { key: "categories", path: "/categories" },
  { key: "about", path: "/about" },
  { key: "contact", path: "/contact" },
];

export default function Header({
  locale,
  t,
}: {
  locale: Locale;
  t: HeaderText;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    setLangMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const pathWithoutLocale =
    pathname.replace(new RegExp(`^/${locale}`), "") || "/";

  function switchLocaleHref(target: Locale) {
    return `/${target}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;
  }

  function handleLocaleSwitch(target: Locale) {
    document.cookie = `${cookieName}=${target}; path=/; max-age=31536000`;
  }

  return (
    <header className="sticky top-0 z-40 bg-canvas">
      <div className="border-b border-border bg-ink text-surface">
        <p className="label-caps mx-auto max-w-[1440px] px-5 py-2 text-center tracking-[0.18em] text-surface/80 md:px-16">
          {t.banner}
        </p>
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-5 py-4 md:px-16">
          <Link href={`/${locale}`} className="flex items-center gap-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center border border-ink text-sm">
              G
            </span>
            <span className="leading-tight">
              <span className="block font-display text-lg">Galassia</span>
              <span className="label-caps block text-graphite">Epoxy Design</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {NAV_PATHS.map(({ key, path }) => {
              const href = `/${locale}${path}`;
              const isActive =
                path === "" ? pathWithoutLocale === "/" : pathWithoutLocale.startsWith(path);
              return (
                <Link
                  key={key}
                  href={href}
                  className={`label-caps whitespace-nowrap transition-colors ${
                    isActive ? "text-ink" : "text-graphite hover:text-ink"
                  }`}
                >
                  {t.nav[key]}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <button
                type="button"
                aria-label={t.language}
                aria-expanded={langMenuOpen}
                onClick={() => setLangMenuOpen((open) => !open)}
                className="label-caps flex h-10 items-center gap-1 border border-ink px-3 text-ink"
              >
                {locale.toUpperCase()}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {langMenuOpen && (
                <div className="absolute end-0 top-full z-50 mt-1 w-36 border border-ink bg-canvas">
                  {languages.map((lng) => (
                    <a
                      key={lng}
                      href={switchLocaleHref(lng)}
                      onClick={() => handleLocaleSwitch(lng)}
                      className={`label-caps block px-4 py-3 ${
                        lng === locale ? "bg-ink text-surface" : "text-ink hover:bg-border"
                      }`}
                    >
                      {localeLabels[lng]}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a
              href={whatsappHref(t.whatsappOpener)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary label-caps hidden sm:inline-flex"
            >
              {t.chatWhatsapp}
            </a>
            <button
              type="button"
              aria-label={t.account}
              className="hidden h-10 w-10 flex-shrink-0 items-center justify-center border border-ink text-ink sm:flex"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={menuOpen ? t.closeMenu : t.openMenu}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-ink text-ink lg:hidden"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                {menuOpen ? (
                  <path d="M5 5l14 14M19 5 5 19" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-border bg-canvas lg:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-5 py-2 md:px-16">
            {NAV_PATHS.map(({ key, path }) => {
              const href = `/${locale}${path}`;
              const isActive =
                path === "" ? pathWithoutLocale === "/" : pathWithoutLocale.startsWith(path);
              return (
                <Link
                  key={key}
                  href={href}
                  className={`label-caps border-t border-border py-4 first:border-t-0 ${
                    isActive ? "text-ink" : "text-graphite"
                  }`}
                >
                  {t.nav[key]}
                </Link>
              );
            })}
            <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
              {languages.map((lng) => (
                <a
                  key={lng}
                  href={switchLocaleHref(lng)}
                  onClick={() => handleLocaleSwitch(lng)}
                  className={`label-caps border px-3 py-2 ${
                    lng === locale ? "border-ink bg-ink text-surface" : "border-border text-graphite"
                  }`}
                >
                  {localeLabels[lng]}
                </a>
              ))}
            </div>
            <a
              href={whatsappHref(t.whatsappOpener)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary label-caps mt-4 w-full sm:hidden"
            >
              {t.chatWhatsapp}
            </a>
            <button
              type="button"
              aria-label={t.account}
              className="label-caps mt-3 flex w-full items-center justify-center gap-2 border border-ink px-4 py-3 text-ink sm:hidden"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
              {t.account}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
