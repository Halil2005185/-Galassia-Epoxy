import axios from "axios";
import type { ApiErrorBody } from "../types";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  // The refresh token lives in an HttpOnly cookie — it has to ride along on
  // every request for the browser to send/receive it cross-origin.
  withCredentials: true,
});

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

let sessionExpiredHandler: (() => void) | null = null;

// Called once, from App, so the UI can drop back to the login screen when
// a 401 survives a refresh attempt (refresh token itself expired/revoked).
export function setOnSessionExpired(handler: (() => void) | null): void {
  sessionExpiredHandler = handler;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken && !config.url?.includes("/auth/login")) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = apiClient
      .post<{ accessToken: string }>("/auth/refresh")
      .then(({ data }) => {
        accessToken = data.accessToken;
        return accessToken;
      })
      .catch(() => {
        accessToken = null;
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && originalRequest && !isAuthEndpoint && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshAccessToken();

      if (newToken) {
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }

      sessionExpiredHandler?.();
    }

    return Promise.reject(error);
  }
);

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
  "Invalid email or password.": "البريد الإلكتروني أو كلمة المرور غير صحيحة.",
  "Authentication required.": "يجب تسجيل الدخول أولاً.",
  "Invalid or expired access token.": "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا.",
  "Refresh token missing.": "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا.",
  "Invalid or expired refresh token.": "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مجددًا.",
  "Refresh token has been invalidated.": "تم إنهاء الجلسة، يرجى تسجيل الدخول مجددًا.",
  "Admin not found.": "الحساب غير موجود.",
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
