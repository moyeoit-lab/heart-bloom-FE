type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: BodyInit | null;
  headers?: HeadersInit;
};

const ACCESS_TOKEN_KEY = "accessToken";
// 401 발생 시 동시 요청들이 다 redirect 트리거하지 않도록 막는 모듈 레벨 플래그.
let isAuthRedirecting = false;

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "");

const isBrowser = () => typeof window !== "undefined";

// JWT exp 디코드해서 만료 여부 판단. BE가 expiresIn을 별도로 안 줘서 토큰에서 직접 추출.
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(
      atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (typeof payload?.exp !== "number") return true;
    return Date.now() / 1000 >= payload.exp;
  } catch {
    return true;
  }
};

const readAccessToken = () => {
  if (!isBrowser()) return null;
  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!token) return null;
  // 만료된 토큰은 헤더에 박지 않고 미리 정리.
  if (isTokenExpired(token)) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    return null;
  }
  return token;
};

const handleUnauthorized = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  const pathname = window.location.pathname;
  // 홈/OAuth 콜백에서 401이 떨어지면 무한 리다이렉트 방지 위해 스킵.
  const isAuthPage =
    pathname === "/" || pathname.startsWith("/oauth/callback");
  if (isAuthPage || isAuthRedirecting) return;
  isAuthRedirecting = true;
  window.location.replace("/?expired=1");
};

export const buildApiUrl = (baseUrl: string, path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizeBaseUrl(baseUrl)}${normalizedPath}`;
};

export const apiRequest = async <T>(
  baseUrl: string,
  path: string,
  options: RequestOptions = {},
) => {
  const token = readAccessToken();
  const response = await fetch(buildApiUrl(baseUrl, path), {
    method: options.method ?? "GET",
    body: options.body,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
  }

  if (!response.ok) {
    // BE 에러 메시지를 그대로 노출 — 디버깅에 필수.
    const text = await response.text().catch(() => "");
    throw new Error(
      `API request failed: ${response.status} ${path}${text ? ` — ${text}` : ""}`,
    );
  }

  return (await response.json()) as T;
};
