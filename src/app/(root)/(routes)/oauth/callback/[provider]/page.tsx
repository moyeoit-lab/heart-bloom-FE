"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { toast } from "@/components/Toast";

export default function OAuthCallbackPage() {
  const params = useParams<{ provider: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (params.provider?.toLowerCase() !== "kakao") {
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

      const provider = params.provider.toLowerCase();
      const redirectUri = `${window.location.origin.replace(/\/+$/, "")}/oauth/callback/${provider}`;
      const loginQueryParams = new URLSearchParams({
        code,
        redirectUri,
      });
      const loginEndpoint = `${apiUrl.replace(/\/+$/, "")}/api/v1/auth/oauth2/${provider}/login?${loginQueryParams.toString()}`;

      try {
        const response = await fetch(loginEndpoint, {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error(`Failed to login: ${response.status}`);
        }

        const payload = (await response.json()) as {
          success?: boolean;
          message?: string;
          data?: { accessToken?: string };
          accessToken?: string;
        };

        const accessToken = payload?.data?.accessToken ?? payload?.accessToken;
        if (!accessToken) {
          throw new Error("Access token not found in response");
        }

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