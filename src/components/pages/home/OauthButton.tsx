"use client";

import { useState } from "react";

import { Button } from "@/components/Button";
import { toast } from "@/components/Toast";

type OauthButtonProps = {
  provider: string;
  className?: string;
};

export default function OauthButton({
  provider,
  className = "",
}: OauthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const buildLoginUrlEndpoint = (baseUrl: string, redirectUri: string, state: string) => {
    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const queryParams = new URLSearchParams({
      redirectUri,
      state,
    });
    return `${normalizedBaseUrl}/api/v1/auth/oauth2/${provider}/login-url?${queryParams.toString()}`;
  };

  const handleClick = async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const state = "1";

    if (!apiUrl) {
      toast("API URL 환경 변수가 설정되지 않았어요.");
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const redirectUri = `${window.location.origin.replace(/\/+$/, "")}/oauth/callback/${provider}`;
      const response = await fetch(buildLoginUrlEndpoint(apiUrl, redirectUri, state), {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch login url: ${response.status}`);
      }

      const payload = (await response.json()) as
        | { loginUrl?: string; data?: { loginUrl?: string }; url?: string }
        | string;

      const loginUrl =
        typeof payload === "string"
          ? payload
          : payload?.loginUrl ?? payload?.data?.loginUrl ?? payload?.url;

      if (!loginUrl) {
        throw new Error("Login URL not found in response");
      }

      window.location.href = loginUrl;
    } catch (error) {
      console.error(error);
      toast("카카오 로그인 연결에 실패했어요. 잠시 후 다시 시도해 주세요.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="kakao"
      type="button"
      aria-label="카카오로 계속하기"
      className={`h-12 w-full bg-[#f9e105] ${className}`.trim()}
      onClick={handleClick}
      disabled={isLoading}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
        className="h-6 w-6 text-[var(--color-brown-400)]"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M11.9998 3.1543C6.79527 3.1543 2.57129 6.43544 2.57129 10.4709C2.57129 12.9883 4.20243 15.1852 6.69156 16.524L5.64499 20.3614C5.62525 20.4378 5.62931 20.5183 5.65664 20.5923C5.68397 20.6662 5.73326 20.73 5.79789 20.7752C5.86253 20.8203 5.93943 20.8446 6.01827 20.8448C6.09711 20.845 6.17413 20.8211 6.23899 20.7763L10.8213 17.7309C11.2078 17.7309 11.6038 17.7969 11.9998 17.7969C17.2044 17.7969 21.4284 14.5157 21.4284 10.4709C21.4284 6.42601 17.2044 3.1543 11.9998 3.1543Z"
          fill="currentColor"
        />
      </svg>
      <span className="text-[var(--color-brown-400)]">카카오로 계속하기</span>
    </Button>
  );
}
