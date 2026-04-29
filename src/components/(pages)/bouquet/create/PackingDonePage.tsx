"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import downloadIcon from "@/assets/icons/download-icon.svg";
import homeIcon from "@/assets/icons/home-icon.svg";
import blueMiniA from "@/assets/images/packing/blue-mini-a.svg";
import blueMiniQ from "@/assets/images/packing/blue-mini-q.svg";
import pinkMiniA from "@/assets/images/packing/pink-mini-a.svg";
import pinkMiniQ from "@/assets/images/packing/pink-mini-q.svg";
import redMiniA from "@/assets/images/packing/red-mini-a.svg";
import redMiniQ from "@/assets/images/packing/red-mini-q.svg";
import yellowMiniA from "@/assets/images/packing/yellow-mini-a.svg";
import yellowMiniQ from "@/assets/images/packing/yellow-mini-q.svg";
import { Button } from "@/components/Button";
import { Switch } from "@/components/Switch";
import { toast } from "@/components/Toast";
import {
  useBouquetLinkUrlQuery,
  type BouquetTypeKey,
} from "@/features/bouquet";
import { getQuestions } from "@/shared/constants/bouquetQuestions";
import { useBouquetCreationResult } from "@/shared/hooks/useBouquetCreationResult";

const PAGE_WIDTH = 375;
const SCENE_HEIGHT = 812;
const DEFAULT_NICKNAME = "이름";
const DEFAULT_RECIPIENT = "상대방";
const DEFAULT_BOUQUET_KEY: BouquetTypeKey = "YELLOW_TULIP";

type StaticImg = import("next/image").StaticImageData;

type PackingDoneVisual = {
  bgClass: string;
  nicknameColor: string;
  miniQ: StaticImg;
  miniA: StaticImg;
};

const PACKING_DONE_VISUALS: Record<BouquetTypeKey, PackingDoneVisual> = {
  YELLOW_TULIP: {
    bgClass: "bg-gradient-to-b from-[#fff3c0] to-[#fffadf]",
    nicknameColor: "var(--color-point-yellow)",
    miniQ: yellowMiniQ,
    miniA: yellowMiniA,
  },
  RED_CARNATION: {
    bgClass:
      "bg-gradient-to-b from-[#ffa2a8] via-[#ffe3c3] via-[71.272%] to-[#fffed7] to-[138.55%]",
    nicknameColor: "var(--color-point-red)",
    miniQ: redMiniQ,
    miniA: redMiniA,
  },
  BLUE_LILY: {
    bgClass: "bg-gradient-to-t from-[#e8f0d2] to-[#79c0ff] to-[112.41%]",
    nicknameColor: "var(--color-point-blue)",
    miniQ: blueMiniQ,
    miniA: blueMiniA,
  },
  PINK_GERBERA: {
    bgClass: "bg-gradient-to-t from-[#feffd7] to-[#ffd0db] to-[112.41%]",
    nicknameColor: "var(--color-red-400)",
    miniQ: pinkMiniQ,
    miniA: pinkMiniA,
  },
};

const VALID_BOUQUET_KEYS = new Set<BouquetTypeKey>(
  Object.keys(PACKING_DONE_VISUALS) as BouquetTypeKey[],
);

type FlowerClickRegion = {
  left: number;
  top: number;
  width: number;
  height: number;
};

type KakaoShareArgs = {
  objectType: "feed";
  content: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  buttons: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
};

type KakaoSdk = {
  isInitialized: () => boolean;
  init: (appKey: string) => void;
  Share: {
    sendDefault: (args: KakaoShareArgs) => void;
  };
};

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

const KAKAO_SDK_ID = "kakao-js-sdk";
const KAKAO_SDK_URL = "https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js";

const loadKakaoSdk = async (): Promise<KakaoSdk> => {
  if (typeof window === "undefined") {
    throw new Error("브라우저 환경에서만 카카오 SDK를 사용할 수 있습니다.");
  }

  if (window.Kakao) {
    return window.Kakao;
  }

  await new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(
      KAKAO_SDK_ID,
    ) as HTMLScriptElement | null;

    const onLoad = () => resolve();
    const onError = () => reject(new Error("카카오 SDK 로드에 실패했어요."));

    if (existingScript) {
      existingScript.addEventListener("load", onLoad, { once: true });
      existingScript.addEventListener("error", onError, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = KAKAO_SDK_ID;
    script.src = KAKAO_SDK_URL;
    script.async = true;
    script.onload = onLoad;
    script.onerror = onError;
    document.head.appendChild(script);
  });

  if (!window.Kakao) {
    throw new Error("카카오 SDK가 준비되지 않았어요.");
  }

  return window.Kakao;
};

// 좌표는 mini SVG의 viewBox(375×812) 기준. 배열 인덱스 = 질문 step - 1.
const FLOWER_CLICK_REGIONS: Record<BouquetTypeKey, FlowerClickRegion[]> = {
  YELLOW_TULIP: [
    { left: 210, top: 222, width: 100, height: 127 },
    { left: 171, top: 345, width: 95, height: 92 },
    { left: 61, top: 337, width: 124, height: 104 },
    { left: 84, top: 208, width: 147, height: 148 },
  ],
  RED_CARNATION: [
    { left: 57, top: 317, width: 145, height: 143 },
    { left: 173, top: 350, width: 108, height: 102 },
    { left: 178, top: 227, width: 159, height: 159 },
    { left: 68, top: 215, width: 157, height: 146 },
  ],
  BLUE_LILY: [
    { left: 175, top: 363, width: 111, height: 102 },
    { left: 193, top: 273, width: 144, height: 101 },
    { left: 65, top: 190, width: 157, height: 189 },
    { left: 70, top: 364, width: 104, height: 85 },
  ],
  PINK_GERBERA: [
    { left: 91, top: 228, width: 126, height: 109 },
    { left: 159, top: 349, width: 125, height: 122 },
    { left: 189, top: 262, width: 118, height: 120 },
    { left: 69, top: 334, width: 115, height: 97 },
  ],
};

export default function PackingDonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname")?.trim() || DEFAULT_NICKNAME;
  const recipient = searchParams.get("recipient")?.trim() || DEFAULT_RECIPIENT;
  const rawType = searchParams.get("bouquetType")?.trim() ?? "";
  const bouquetTypeKey = VALID_BOUQUET_KEYS.has(rawType as BouquetTypeKey)
    ? (rawType as BouquetTypeKey)
    : DEFAULT_BOUQUET_KEY;

  const [showMessages, setShowMessages] = useState(false);
  const visual = PACKING_DONE_VISUALS[bouquetTypeKey];
  const heroSrc = showMessages ? visual.miniA : visual.miniQ;
  const flowerRegions = FLOWER_CLICK_REGIONS[bouquetTypeKey];
  const questions = getQuestions(bouquetTypeKey);
  const kakaoJsKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

  const { result } = useBouquetCreationResult();
  const bouquetId = result?.bouquetId;
  const { data: shareUrl, isPending: isShareUrlPending } =
    useBouquetLinkUrlQuery(bouquetId);

  useEffect(() => {
    if (!kakaoJsKey) {
      return;
    }

    let cancelled = false;

    loadKakaoSdk()
      .then((kakao) => {
        if (cancelled) {
          return;
        }
        if (!kakao.isInitialized()) {
          kakao.init(kakaoJsKey);
        }
      })
      .catch((error: unknown) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, [kakaoJsKey]);

  const handleFlowerClick = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/bouquet/create/done/flower/${step}?${params.toString()}`);
  };

  const handleShare = async () => {
    if (!shareUrl) {
      toast("공유 링크를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    try {
      if (kakaoJsKey) {
        const kakao = await loadKakaoSdk();

        if (!kakao.isInitialized()) {
          kakao.init(kakaoJsKey);
        }

        const imageUrl = new URL("/images/home.png", window.location.origin).toString();
        kakao.Share.sendDefault({
          objectType: "feed",
          content: {
            title: `${nickname}님의 꽃다발`,
            description: `${recipient}에게 꽃다발 링크를 공유해보세요.`,
            imageUrl,
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
          buttons: [
            {
              title: "꽃다발 보러 가기",
              link: {
                mobileWebUrl: shareUrl,
                webUrl: shareUrl,
              },
            },
          ],
        });
        return;
      }

      if (navigator.share) {
        await navigator.share({ url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      toast("공유 링크를 복사했어요.");
    } catch (error) {
      console.error(error);
      toast("공유에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleDownload = () => {
    // TODO: 이미지 저장
    console.info("[bouquet/create/done] download clicked");
  };

  return (
    <main
      className={`relative mx-auto flex min-h-dvh flex-col overflow-hidden ${visual.bgClass}`}
      style={{ width: PAGE_WIDTH }}
    >
      {/* SVG 장면 + 클릭 영역은 고정 812 높이 컨테이너 안에 함께 — 좌표 일관성 */}
      <div
        className="pointer-events-none absolute left-0 top-0 z-0"
        style={{ width: PAGE_WIDTH, height: SCENE_HEIGHT }}
      >
        <Image
          src={heroSrc}
          alt=""
          aria-hidden
          priority
          fill
          sizes={`${PAGE_WIDTH}px`}
          className="object-cover object-top"
        />
      </div>

      <div
        className="absolute left-0 top-0 z-10"
        style={{ width: PAGE_WIDTH, height: SCENE_HEIGHT }}
      >
        {flowerRegions.map((region, index) => {
          const step = index + 1;
          const subjectTitle = questions[index]?.subjectTitle ?? `Q${step}`;
          return (
            <button
              key={index}
              type="button"
              onClick={() => handleFlowerClick(step)}
              aria-label={`${subjectTitle} 자세히 보기`}
              className="absolute cursor-pointer bg-transparent"
              style={{
                left: region.left,
                top: region.top,
                width: region.width,
                height: region.height,
              }}
            />
          );
        })}
      </div>

      <header className="relative z-20 flex items-center justify-between p-4">
        <Link href="/" aria-label="홈으로 돌아가기">
          <Image src={homeIcon} alt="" aria-hidden width={24} height={24} />
        </Link>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="typo-caption-1 text-[var(--color-brown-200)]">
              메시지 보이기
            </span>
            <Switch
              checked={showMessages}
              onCheckedChange={setShowMessages}
              aria-label="메시지 보이기 토글"
            />
          </label>
          <button
            type="button"
            onClick={handleDownload}
            aria-label="이미지 저장"
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image
              src={downloadIcon}
              alt=""
              aria-hidden
              width={24}
              height={24}
            />
          </button>
        </div>
      </header>

      <section className="relative z-20 flex flex-col items-center gap-4 px-5 pb-5">
        <h1 className="typo-title-2 text-center" style={{ lineHeight: "30px" }}>
          <span style={{ color: visual.nicknameColor }}>{nickname}</span>
          <span className="text-[var(--color-brown-300)]">
            님의 꽃다발 준비중
          </span>
        </h1>
        <p className="typo-body-2 text-center text-[var(--color-brown-300)]">
          <span>{recipient}</span>에게 링크를 공유하고
          <br />
          우리만의 더 풍성한 꽃다발을 완성해보세요
        </p>
      </section>

      <div className="relative z-20 mt-auto p-5">
        <Button
          variant="solid"
          onClick={handleShare}
          disabled={!bouquetId || isShareUrlPending}
          className="h-12 w-full"
        >
          꽃다발 공유하기
        </Button>
      </div>
    </main>
  );
}
