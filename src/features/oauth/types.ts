export const OAUTH_PROVIDER = "kakao" as const;

export type OAuthProvider = typeof OAUTH_PROVIDER;

export type OAuthAuthorizeRequest = {
  baseUrl: string;
  redirectUri: string;
  state: string;
};

export type OAuthAuthorizeResponse =
  | string
  | {
      loginUrl?: string;
      data?: { loginUrl?: string };
      url?: string;
    };

export type OAuthLoginRequest = {
  baseUrl: string;
  code: string;
  redirectUri: string;
};

export type OAuthLoginResponse = {
  success?: boolean;
  message?: string;
  data?: { accessToken?: string };
  accessToken?: string;
};
