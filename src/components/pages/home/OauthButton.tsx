"use client";

import Image from "next/image";
import { useState } from "react";

import kakaoIcon from "@/assets/icons/kakao-icon.svg";
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
      <Image src={kakaoIcon} alt="" aria-hidden className="h-6 w-6" />
      <span className="text-brown-400">카카오로 계속하기</span>
    </Button>
  );
}
