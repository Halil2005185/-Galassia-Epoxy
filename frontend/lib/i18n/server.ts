import { createInstance } from "i18next";
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next/initReactI18next";
import { getOptions, type Locale, type Namespace, defaultNS } from "./settings";

async function initI18next(lng: Locale, ns: Namespace | Namespace[]) {
  const instance = createInstance();
  await instance
    .use(initReactI18next)
    .use(
      resourcesToBackend(
        (language: string, namespace: string) =>
          import(`../../locales/${language}/${namespace}.json`)
      )
    )
    .init(getOptions(lng, ns));
  return instance;
}

export async function getTranslation(
  lng: Locale,
  ns: Namespace | Namespace[] = defaultNS
) {
  const instance = await initI18next(lng, ns);
  const namespace = Array.isArray(ns) ? ns[0] : ns;
  return {
    t: instance.getFixedT(lng, namespace),
    i18n: instance,
  };
}
