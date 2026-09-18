import type { LocalizedText } from "../types";

const LOCALE_LABELS: Record<keyof LocalizedText, string> = {
  ar: "بالعربية",
  en: "بالإنجليزية",
  tr: "بالتركية",
};

export default function LocalizedTextInput({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: LocalizedText;
  onChange: (value: LocalizedText) => void;
  multiline?: boolean;
}) {
  const handleChange =
    (locale: keyof LocalizedText) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onChange({ ...value, [locale]: e.target.value });
    };

  return (
    <div>
      <p className="label-caps text-graphite">{label}</p>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {(Object.keys(LOCALE_LABELS) as (keyof LocalizedText)[]).map((locale) => (
          <div key={locale}>
            <label className="text-xs text-graphite">{LOCALE_LABELS[locale]}</label>
            {multiline ? (
              <textarea
                rows={3}
                value={value[locale]}
                onChange={handleChange(locale)}
                className="input-field mt-1"
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            ) : (
              <input
                value={value[locale]}
                onChange={handleChange(locale)}
                className="input-field mt-1"
                dir={locale === "ar" ? "rtl" : "ltr"}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
