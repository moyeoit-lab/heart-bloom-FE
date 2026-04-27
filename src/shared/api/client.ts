type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: BodyInit | null;
  headers?: HeadersInit;
};

const normalizeBaseUrl = (baseUrl: string) => baseUrl.replace(/\/+$/, "");

const isBrowser = () => typeof window !== "undefined";

const readAccessToken = () =>
  isBrowser() ? window.localStorage.getItem("accessToken") : null;

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

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return (await response.json()) as T;
};
