"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

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
import type { BouquetTypeKey } from "@/features/bouquet";
import { getQuestions } from "@/shared/constants/bouquetQuestions";

const PAGE_WIDTH = 375;
const PAGE_HEIGHT = 812;
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
    bgClass:
      "bg-gradient-to-t from-[#e8f0d2] to-[#79c0ff] to-[112.41%]",
    nicknameColor: "var(--color-point-blue)",
    miniQ: blueMiniQ,
    miniA: blueMiniA,
  },
  PINK_GERBERA: {
    bgClass:
      "bg-gradient-to-t from-[#feffd7] to-[#ffd0db] to-[112.41%]",
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

// 좌표는 mini SVG의 viewBox(375×812) 기준. 배열 인덱스 = 질문 step - 1.
// 모든 매핑은 사용자가 토글 ON 한 SVG 라벨을 보고 검증/지정한 순서.
const FLOWER_CLICK_REGIONS: Record<BouquetTypeKey, FlowerClickRegion[]> = {
  YELLOW_TULIP: [
    { left: 210, top: 222, width: 100, height: 127 }, // Q1 단둘이 있던 시간 (top-right)
    { left: 171, top: 345, width: 95, height: 92 }, // Q2 즐거웠던 때 (bottom-right)
    { left: 61, top: 337, width: 124, height: 104 }, // Q3 돌아가고싶은 순간 (bottom-left)
    { left: 84, top: 208, width: 147, height: 148 }, // Q4 같이 하고싶은 것 (top-left)
  ],
  RED_CARNATION: [
    { left: 57, top: 317, width: 145, height: 143 }, // Q1 고마웠던 순간 (추정 — bottom-left)
    { left: 173, top: 350, width: 108, height: 102 }, // Q2 할 수 있게 된 것 (추정 — bottom-right)
    { left: 178, top: 227, width: 159, height: 159 }, // Q3 챙겨주는 느낌 (검증됨 — top-right)
    { left: 68, top: 215, width: 157, height: 146 }, // Q4 기억에 남는 한 마디 (검증됨 — top-left)
  ],
  BLUE_LILY: [
    { left: 175, top: 363, width: 111, height: 102 }, // Q1 (rightmost-ish)
    { left: 193, top: 273, width: 144, height: 101 }, // Q2
    { left: 65, top: 190, width: 157, height: 189 }, // Q3 (leftmost)
    { left: 70, top: 364, width: 104, height: 85 }, // Q4
  ],
  PINK_GERBERA: [
    { left: 91, top: 228, width: 126, height: 109 }, // Q1
    { left: 159, top: 349, width: 125, height: 122 }, // Q2 (was Q4 position)
    { left: 189, top: 262, width: 118, height: 120 }, // Q3
    { left: 69, top: 334, width: 115, height: 97 }, // Q4 (was Q2 position)
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

  const handleFlowerClick = (step: number) => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(`/bouquet/create/done/flower/${step}?${params.toString()}`);
  };

  const handleShare = () => {
    // TODO: 공유 동작 (kakao share / 링크 복사)
    console.info("[bouquet/create/done] share clicked");
  };

  const handleDownload = () => {
    // TODO: 이미지 저장
    console.info("[bouquet/create/done] download clicked");
  };

  return (
    <main
      className={`relative mx-auto flex min-h-dvh flex-col overflow-hidden ${visual.bgClass}`}
      style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT }}
    >
      <Image
        src={heroSrc}
        alt=""
        aria-hidden
        priority
        fill
        sizes={`${PAGE_WIDTH}px`}
        className="pointer-events-none object-cover object-center"
      />

      {flowerRegions.map((region, index) => {
        const step = index + 1;
        const subjectTitle = questions[index]?.subjectTitle ?? `Q${step}`;
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleFlowerClick(step)}
            aria-label={`${subjectTitle} 자세히 보기`}
            className="absolute z-10 cursor-pointer bg-transparent"
            style={{
              left: region.left,
              top: region.top,
              width: region.width,
              height: region.height,
            }}
          >
            {process.env.NODE_ENV === "development" ? (
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border-2 border-white bg-black/80 px-2 py-1 text-[11px] font-bold text-white"
              >
                Q{step}: {subjectTitle}
              </span>
            ) : null}
          </button>
        );
      })}

      <header className="relative z-10 flex items-center justify-between p-4">
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
            <Image src={downloadIcon} alt="" aria-hidden width={24} height={24} />
          </button>
        </div>
      </header>

      <section className="relative z-10 flex flex-col items-center gap-4 px-5 pb-5">
        <h1
          className="typo-title-2 text-center"
          style={{ lineHeight: "30px" }}
        >
          <span style={{ color: visual.nicknameColor }}>{nickname}</span>
          <span className="text-[var(--color-brown-300)]">님의 꽃다발 준비중</span>
        </h1>
        <p className="typo-body-2 text-center text-[var(--color-brown-300)]">
          <span>{recipient}</span>에게 링크를 공유하고
          <br />
          우리만의 더 풍성한 꽃다발을 완성해보세요
        </p>
      </section>

      <div className="relative z-10 mt-auto p-5">
        <Button
          variant="solid"
          onClick={handleShare}
          className="h-12 w-full"
        >
          꽃다발 공유하기
        </Button>
      </div>
    </main>
  );
}
