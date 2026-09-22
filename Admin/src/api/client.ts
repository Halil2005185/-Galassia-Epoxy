import axios from "axios";
import type { ApiErrorBody } from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// The backend (Joi / Mongoose / the AWS SDK) only ever replies in English.
// This UI must never show English, so every backend message is translated
// here. Anything not explicitly recognized falls back to the caller's Arabic
// fallback instead of leaking the raw English text.
const FIELD_LABELS_AR: Record<string, string> = {
  name: "الاسم",
  description: "الوصف",
  slug: "الرابط المختصر",
  category: "الفئة",
  images: "الصور",
};

function translateField(field: string): string {
  return FIELD_LABELS_AR[field] ?? field;
}

const KNOWN_MESSAGES: Record<string, string> = {
  "Category not found": "الفئة غير موجودة.",
  "Product not found": "المنتج غير موجود.",
  "Category with this slug already exists": "توجد فئة أخرى بنفس الرابط المختصر.",
  "Slug must be lowercase, alphanumeric, and hyphen-separated.":
    "يجب أن يتكوّن الرابط المختصر من أحرف إنجليزية صغيرة وأرقام وشرطات فقط.",
  "Internal Server Error": "حدث خطأ في الخادم، حاول مرة أخرى.",
};

const PATTERN_TRANSLATORS: { pattern: RegExp; translate: (match: RegExpMatchArray) => string }[] = [
  {
    pattern: /^Invalid value for field "(.+)"\.$/,
    translate: (m) => `قيمة غير صالحة في حقل "${translateField(m[1] ?? "")}".`,
  },
  {
    pattern: /^A record with this (.+) already exists\.$/,
    translate: (m) => `يوجد سجل آخر بنفس ${translateField(m[1] ?? "")}.`,
  },
  {
    pattern: /^Invalid JSON in "(.+)" field\.$/,
    translate: (m) => `تنسيق غير صالح في حقل "${translateField(m[1] ?? "")}".`,
  },
];

function translateBackendMessage(message: string | undefined, fallback: string): string {
  if (!message) return fallback;
  if (message in KNOWN_MESSAGES) return KNOWN_MESSAGES[message] as string;

  for (const { pattern, translate } of PATTERN_TRANSLATORS) {
    const match = message.match(pattern);
    if (match) return translate(match);
  }

  // Unrecognized (raw Joi/Mongoose/AWS SDK text) — never show it in English.
  return fallback;
}

/**
 * Always returns an Arabic message: translates known backend error strings,
 * and falls back to the caller-supplied Arabic message for anything else
 * (unrecognized backend text, or a network failure with no response at all).
 */
export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    return translateBackendMessage(error.response?.data?.message, fallback);
  }
  return fallback;
}

export default apiClient;
