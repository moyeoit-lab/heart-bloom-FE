import { apiRequest } from "@/shared/api/client";

import type {
  OAuthAuthorizeRequest,
  OAuthAuthorizeResponse,
  OAuthLoginRequest,
  OAuthLoginResponse,
} from "@/features/oauth/types";
import { OAUTH_PROVIDER } from "@/features/oauth/types";

const getLoginUrlFromPayload = (payload: OAuthAuthorizeResponse) => {
  const loginUrl =
    typeof payload === "string" ? payload : payload?.loginUrl ?? payload?.data?.loginUrl ?? payload?.url;

  if (!loginUrl) {
    throw new Error("Login URL not found in response");
  }

  return loginUrl;
};

const getAccessTokenFromPayload = (payload: OAuthLoginResponse) => {
  const accessToken = payload?.data?.accessToken ?? payload?.accessToken;
  if (!accessToken) {
    throw new Error("Access token not found in response");
  }

  return accessToken;
};

export const isKakaoProvider = (provider: string): provider is typeof OAUTH_PROVIDER => {
  return provider === OAUTH_PROVIDER;
};

export const oauthApi = {
  authorize: async ({ baseUrl, redirectUri, state }: OAuthAuthorizeRequest): Promise<void> => {
    const queryParams = new URLSearchParams({
      redirectUri,
      state,
    });
    const path = `/api/v1/auth/oauth2/${OAUTH_PROVIDER}/login-url?${queryParams.toString()}`;
    const payload = await apiRequest<OAuthAuthorizeResponse>(baseUrl, path, { method: "GET" });
    const loginUrl = getLoginUrlFromPayload(payload);

    window.location.href = loginUrl;
  },

  login: async ({ baseUrl, code, redirectUri }: OAuthLoginRequest): Promise<string> => {
    const queryParams = new URLSearchParams({
      code,
      redirectUri,
    });
    const path = `/api/v1/auth/oauth2/${OAUTH_PROVIDER}/login?${queryParams.toString()}`;
    const payload = await apiRequest<OAuthLoginResponse>(baseUrl, path, { method: "POST" });

    return getAccessTokenFromPayload(payload);
  },
};
