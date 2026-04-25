"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { toast } from "@/components/Toast";
import { isKakaoProvider, oauthApi } from "@/features/oauth/api";
import { OAUTH_PROVIDER } from "@/features/oauth/types";

export default function OAuthCallbackPage() {
  const params = useParams<{ provider: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const provider = params.provider?.toLowerCase();
      if (!provider || !isKakaoProvider(provider)) {
        toast("지원하지 않는 로그인 방식이에요.");
        router.replace("/");
        return;
      }

      const callbackParams = Object.fromEntries(searchParams.entries());
      console.log("[oauth/callback/kakao] query params:", callbackParams);

      const error = searchParams.get("error");
      if (error) {
        toast("카카오 로그인에 실패했어요. 다시 시도해 주세요.");
        router.replace("/");
        return;
      }

      const code = searchParams.get("code");
      if (!code) {
        toast("로그인 정보를 확인할 수 없어요. 다시 시도해 주세요.");
        router.replace("/");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) {
        toast("API URL 환경 변수가 설정되지 않았어요.");
        router.replace("/");
        return;
      }

      const redirectUri = `${window.location.origin.replace(/\/+$/, "")}/oauth/callback/${OAUTH_PROVIDER}`;

      try {
        const accessToken = await oauthApi.login({
          baseUrl: apiUrl,
          code,
          redirectUri,
        });

        localStorage.setItem("accessToken", accessToken);
        toast("카카오 로그인이 완료됐어요.");
        router.replace("/");
      } catch (requestError) {
        console.error(requestError);
        toast("카카오 로그인 처리에 실패했어요. 다시 시도해 주세요.");
        router.replace("/");
      }
    };

    void handleOAuthCallback();
  }, [params.provider, router, searchParams]);

  return null;
}