"use client";

import Image from "next/image";
import { useState } from "react";

import kakaoIcon from "@/assets/icons/kakao-icon.svg";
import { Button } from "@/components/Button";
import { toast } from "@/components/Toast";
import { oauthApi } from "@/features/oauth/api";
import { OAUTH_PROVIDER } from "@/features/oauth/types";

type OauthButtonProps = {
  className?: string;
};

export default function OauthButton({ className = "" }: OauthButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

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
      const redirectUri = `${window.location.origin.replace(/\/+$/, "")}/oauth/callback/${OAUTH_PROVIDER}`;
      await oauthApi.authorize({
        baseUrl: apiUrl,
        redirectUri,
        state,
      });
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
