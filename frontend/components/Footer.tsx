import Link from "next/link";
import { getTranslation } from "@/lib/i18n/server";
import type { Locale } from "@/lib/i18n/settings";

export default async function Footer({ locale }: { locale: Locale }) {
  const { t } = await getTranslation(locale, "common");

  const curatedWorks = [
    { label: t("footer.links.allProducts"), href: `/${locale}/products` },
    { label: t("footer.links.diningTables"), href: `/${locale}/products` },
    { label: t("footer.links.servingTrays"), href: `/${locale}/products` },
    { label: t("footer.links.wallArt"), href: `/${locale}/products` },
    { label: t("footer.links.homeAccents"), href: `/${locale}/products` },
  ];

  const atelier = [
    { label: t("footer.links.aboutStudio"), href: `/${locale}/about` },
    { label: t("footer.links.bespokeInquiry"), href: `/${locale}/contact` },
    { label: t("footer.links.careGuide"), href: `/${locale}/about` },
    { label: t("footer.links.privateConsultation"), href: `/${locale}/contact` },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-10 px-5 py-16 md:grid-cols-4 md:px-16">
        <div>
          <span className="font-display text-lg">{t("footer.brandName")}</span>
          <p className="mt-4 max-w-xs text-sm leading-6 text-graphite">
            {t("footer.brandDescription")}
          </p>
          <p className="label-caps mt-6 text-brass">{t("footer.atelierNoticeTitle")}</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-graphite">
            {t("footer.atelierNoticeBody")}
          </p>
        </div>

        <div>
          <p className="label-caps text-graphite">{t("footer.curatedWorks")}</p>
          <ul className="mt-4 space-y-3">
            {curatedWorks.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-ink hover:text-brass">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-caps text-graphite">{t("footer.atelier")}</p>
          <ul className="mt-4 space-y-3">
            {atelier.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sm text-ink hover:text-brass">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="label-caps text-graphite">{t("footer.privateConcierge")}</p>
          <p className="mt-4 max-w-xs text-sm leading-6 text-graphite">
            {t("footer.conciergeBody")}
          </p>
          <p className="mt-4 text-sm">{t("footer.phone")}</p>
          <p className="text-sm text-graphite">{t("footer.hours")}</p>
          <p className="mt-4 text-sm text-graphite">{t("footer.social")}</p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-2 px-5 py-6 text-xs text-graphite md:flex-row md:items-center md:justify-between md:px-16">
          <p>{t("footer.copyright")}</p>
          <p className="label-caps">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}
