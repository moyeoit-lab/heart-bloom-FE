"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import downloadIcon from "@/assets/icons/download-icon.svg";
import homeIcon from "@/assets/icons/home-icon.svg";
import blueOptionalOff from "@/assets/images/bouquet-done/blue-optional-off.svg";
import blueOptionalOn from "@/assets/images/bouquet-done/blue-optional-on.svg";
import blueRequiredOff from "@/assets/images/bouquet-done/blue-required-off.svg";
import blueRequiredOn from "@/assets/images/bouquet-done/blue-required-on.svg";
import pinkOptionalOff from "@/assets/images/bouquet-done/pink-optional-off.svg";
import pinkOptionalOn from "@/assets/images/bouquet-done/pink-optional-on.svg";
import pinkRequiredOff from "@/assets/images/bouquet-done/pink-required-off.svg";
import pinkRequiredOn from "@/assets/images/bouquet-done/pink-required-on.svg";
import redOptionalOff from "@/assets/images/bouquet-done/red-optional-off.svg";
import redOptionalOn from "@/assets/images/bouquet-done/red-optional-on.svg";
import redRequiredOff from "@/assets/images/bouquet-done/red-required-off.svg";
import redRequiredOn from "@/assets/images/bouquet-done/red-required-on.svg";
import yellowOptionalOff from "@/assets/images/bouquet-done/yellow-optional-off.svg";
import yellowOptionalOn from "@/assets/images/bouquet-done/yellow-optional-on.svg";
import yellowRequiredOff from "@/assets/images/bouquet-done/yellow-required-off.svg";
import yellowRequiredOn from "@/assets/images/bouquet-done/yellow-required-on.svg";
import { Button } from "@/components/Button";
import BouquetFlowerDetailOverlay from "@/components/(pages)/bouquet/done/BouquetFlowerDetailOverlay";
import { Switch } from "@/components/Switch";
import {
  useReceiverBouquetQuestionsQuery,
  type BouquetTypeKey,
} from "@/features/bouquet";
import { getQuestionByStep } from "@/shared/constants/bouquetQuestions";

const PAGE_WIDTH = 375;
const SCENE_HEIGHT = 1023;
// SVG에 박힌 모바일 status bar 영역(44px)을 페이지 밖으로 빼기 위한 보정값.
const STATUS_BAR_OFFSET = 44;
const DEFAULT_NICKNAME = "이름";
const DEFAULT_BOUQUET_KEY: BouquetTypeKey = "YELLOW_TULIP";

type HeroVariant = {
  optionalOff: typeof yellowOptionalOff;
  optionalOn: typeof yellowOptionalOn;
  requiredOff: typeof yellowRequiredOff;
  requiredOn: typeof yellowRequiredOn;
};

const HERO_BY_TYPE: Record<BouquetTypeKey, HeroVariant> = {
  YELLOW_TULIP: {
    optionalOff: yellowOptionalOff,
    optionalOn: yellowOptionalOn,
    requiredOff: yellowRequiredOff,
    requiredOn: yellowRequiredOn,
  },
  RED_CARNATION: {
    optionalOff: redOptionalOff,
    optionalOn: redOptionalOn,
    requiredOff: redRequiredOff,
    requiredOn: redRequiredOn,
  },
  BLUE_LILY: {
    optionalOff: blueOptionalOff,
    optionalOn: blueOptionalOn,
    requiredOff: blueRequiredOff,
    requiredOn: blueRequiredOn,
  },
  PINK_GERBERA: {
    optionalOff: pinkOptionalOff,
    optionalOn: pinkOptionalOn,
    requiredOff: pinkRequiredOff,
    requiredOn: pinkRequiredOn,
  },
};

const VALID_BOUQUET_KEYS = new Set<BouquetTypeKey>(
  Object.keys(HERO_BY_TYPE) as BouquetTypeKey[],
);

const pickHero = (
  bouquetTypeKey: BouquetTypeKey,
  hasOptional: boolean,
  showMessages: boolean,
) => {
  const variant = HERO_BY_TYPE[bouquetTypeKey];
  if (hasOptional)
    return showMessages ? variant.optionalOn : variant.optionalOff;
  return showMessages ? variant.requiredOn : variant.requiredOff;
};

// 피그마 16950:11592 좌표에서 STATUS_BAR_OFFSET만큼 위로 보정.
const HEADER_TOP = 44 - STATUS_BAR_OFFSET;
const TAG_TEXT = {
  left: 63.75,
  top: 169 - STATUS_BAR_OFFSET,
  width: 80.983,
  height: 37.18,
};
const FOOTER_TEXT_TOP = 790 - STATUS_BAR_OFFSET;
const ACTION_BUTTONS_TOP = 845 - STATUS_BAR_OFFSET;

// 노트(쪽지) 클릭 시 사용하는 step 값.
const NOTE_STEP = 5;

type FlowerHotspot = {
  step: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

// 꽃다발 SVG 좌표계(375 wide) 기준. 렌더링 시 STATUS_BAR_OFFSET만큼 위로 보정.
const FLOWER_HOTSPOTS_BY_TYPE: Partial<
  Record<BouquetTypeKey, FlowerHotspot[]>
> = {
  YELLOW_TULIP: [
    { step: 1, x: 257.75, y: 274, width: 100.33, height: 126.49 },
    { step: 2, x: 61.08, y: 406.18, width: 113.04, height: 116.79 },
    { step: 3, x: 96.29, y: 343.33, width: 123.73, height: 96.01 },
    { step: 4, x: 67.63, y: 222.31, width: 135.47, height: 137.19 },
  ],
  PINK_GERBERA: [
    { step: 1, x: 186, y: 292, width: 95.09, height: 76.72 },
    { step: 2, x: 28.85, y: 437.32, width: 98.81, height: 89.64 },
    { step: 3, x: 15.92, y: 253.85, width: 120, height: 120.44 },
    { step: 4, x: 126.34, y: 378.41, width: 128.11, height: 108.2 },
  ],
  RED_CARNATION: [
    { step: 1, x: 147, y: 263, width: 125.19, height: 121.24 },
    { step: 2, x: 140, y: 481, width: 190.23, height: 103.93 },
    { step: 3, x: 20.98, y: 438.67, width: 143.65, height: 149.92 },
    { step: 4, x: 70, y: 342, width: 134.33, height: 118.44 },
  ],
  BLUE_LILY: [
    { step: 1, x: 180.77, y: 300.96, width: 111.22, height: 102.49 },
    { step: 2, x: 6.76, y: 416.71, width: 132.98, height: 81.06 },
    { step: 3, x: 122, y: 410, width: 164.18, height: 197.73 },
    { step: 4, x: 217.75, y: 390.31, width: 104.47, height: 84.67 },
  ],
};

const NOTE_HOTSPOT_BY_TYPE: Partial<Record<BouquetTypeKey, FlowerHotspot>> = {
  YELLOW_TULIP: {
    step: NOTE_STEP,
    x: 194,
    y: 388,
    width: 79.74,
    height: 81.14,
  },
  PINK_GERBERA: {
    step: NOTE_STEP,
    x: 179,
    y: 482,
    width: 79.74,
    height: 81.14,
  },
  RED_CARNATION: {
    step: NOTE_STEP,
    x: 199,
    y: 413,
    width: 79.74,
    height: 81.14,
  },
  BLUE_LILY: {
    step: NOTE_STEP,
    x: 56,
    y: 494,
    width: 79.74,
    height: 81.14,
  },
};

export default function ReceiverBouquetDonePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const senderName = searchParams.get("senderName")?.trim() || DEFAULT_NICKNAME;
  const receiverName =
    searchParams.get("receiverName")?.trim() || DEFAULT_NICKNAME;

  const bouquetTypeRaw = searchParams.get("bouquetType")?.trim() ?? "";
  const bouquetTypeKey = VALID_BOUQUET_KEYS.has(
    bouquetTypeRaw as BouquetTypeKey,
  )
    ? (bouquetTypeRaw as BouquetTypeKey)
    : DEFAULT_BOUQUET_KEY;

  // 다른 프엔이 만들 진입/답변 페이지에서 URL ?token=xxx 로 넘겨줄 예정.
  // 토큰이 있으면 BE 응답으로 검증·hasOptional 도출, 없으면 placeholder 모드.
  const token = searchParams.get("token")?.trim() || undefined;
  const { data: receiverQuestions } = useReceiverBouquetQuestionsQuery(token);

  // BE 응답에 OPTIONAL answerType이 있으면 옵셔널 답변 존재. 토큰 없으면 URL 쿼리로 폴백.
  const hasOptional = receiverQuestions
    ? receiverQuestions.some((q) => q.answerType === "OPTIONAL")
    : searchParams.get("hasOptional") !== "false";

  const [showMessages, setShowMessages] = useState(true);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const heroSrc = pickHero(bouquetTypeKey, hasOptional, showMessages);

  const flowerHotspots = FLOWER_HOTSPOTS_BY_TYPE[bouquetTypeKey] ?? [];
  const noteHotspot = NOTE_HOTSPOT_BY_TYPE[bouquetTypeKey];
  const activeQuestion =
    activeStep !== null ? getQuestionByStep(bouquetTypeKey, activeStep) : null;
  const activeTitle =
    activeQuestion?.detailTitle ?? activeQuestion?.subjectTitle ?? "";
  const activeQuestionId = activeQuestion?.questionId;

  const handleShare = () => {
    // TODO: 공유 동작 (kakao share / 링크 복사)
    console.info("[bouquet/receive/done] share clicked");
  };

  const handleCreateNew = () => {
    router.push("/bouquet/create");
  };

  const handleDownload = () => {
    // TODO: html-to-image 설치 후 PNG 캡처/다운로드 구현
    console.info("[bouquet/receive/done] download clicked", {
      bouquetTypeKey,
      hasOptional,
    });
  };

  return (
    <main
      className="relative mx-auto overflow-hidden bg-[#fffadf]"
      style={{ width: PAGE_WIDTH, minHeight: "100dvh" }}
    >
      {/* 꽃다발 SVG (배경) — status bar 영역만큼 위로 시프트해서 빈 공간 제거 */}
      <div
        className="pointer-events-none absolute left-0 z-0"
        style={{
          top: -STATUS_BAR_OFFSET,
          width: PAGE_WIDTH,
          height: SCENE_HEIGHT,
        }}
        aria-hidden
      >
        <Image
          src={heroSrc}
          alt=""
          priority
          fill
          sizes={`${PAGE_WIDTH}px`}
          className="object-cover object-top"
        />
      </div>

      {/* 꽃 클릭 핫스팟 — 꽃다발 SVG 위 보이지 않는 버튼으로 모달 오픈 */}
      {flowerHotspots.map((spot) => (
        <button
          key={`flower-${spot.step}`}
          type="button"
          onClick={() => setActiveStep(spot.step)}
          aria-label={`질문 ${spot.step} 답변 보기`}
          className="absolute z-10 cursor-pointer bg-transparent"
          style={{
            left: spot.x,
            top: spot.y - STATUS_BAR_OFFSET,
            width: spot.width,
            height: spot.height,
          }}
        />
      ))}

      {/* 쪽지 클릭 핫스팟 — optional 응답이 있을 때만 활성 */}
      {hasOptional && noteHotspot ? (
        <button
          type="button"
          onClick={() => setActiveStep(noteHotspot.step)}
          aria-label="못 했던 말 보기"
          className="absolute z-10 cursor-pointer bg-transparent"
          style={{
            left: noteHotspot.x,
            top: noteHotspot.y - STATUS_BAR_OFFSET,
            width: noteHotspot.width,
            height: noteHotspot.height,
          }}
        />
      ) : null}

      {/* 헤더 */}
      <header
        className="absolute left-0 right-0 z-20 flex items-center justify-between p-4"
        style={{ top: HEADER_TOP }}
      >
        <Link href="/" aria-label="홈으로 돌아가기">
          <Image src={homeIcon} alt="" aria-hidden width={24} height={24} />
        </Link>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="typo-caption-1" style={{ color: "#5F4444" }}>
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

      {/* 태그 안 닉네임 — SVG 박힌 라벨 위에 React 텍스트 오버레이 */}
      <div
        className="absolute z-10 flex items-center justify-center"
        style={{
          left: TAG_TEXT.left,
          top: TAG_TEXT.top,
          width: TAG_TEXT.width,
          height: TAG_TEXT.height,
          transform: "rotate(-10deg)",
        }}
      >
        <p
          className="whitespace-nowrap"
          style={{
            fontFamily: "var(--font-paperlogy)",
            fontSize: 16,
            lineHeight: "24px",
            color: "#453030",
          }}
        >
          {senderName} & {receiverName}
        </p>
      </div>

      {/* 하단 안내 문구 */}
      <div
        className="absolute left-0 right-0 z-10 px-5 text-center"
        style={{
          top: FOOTER_TEXT_TOP,
          fontFamily: "var(--font-paperlogy)",
          fontSize: 16,
          lineHeight: "28px",
          color: "#453030",
        }}
      >
        <p>
          <span>{receiverName}</span>
          <span>에게 링크를 공유해서</span>
        </p>
        <p>우리만의 꽃다발이 완성되었다고 알려주세요!</p>
      </div>

      {/* 하단 액션 버튼 */}
      <div
        className="absolute left-0 right-0 z-20 flex gap-2 p-5"
        style={{ top: ACTION_BUTTONS_TOP }}
      >
        <Button
          variant="outlined"
          onClick={handleShare}
          className="h-12 flex-1 whitespace-nowrap px-3"
        >
          링크 복사하기
        </Button>
        <Button
          variant="solid"
          onClick={handleCreateNew}
          className="h-12 flex-1 whitespace-nowrap px-3"
        >
          다른 꽃다발 만들기
        </Button>
      </div>

      {activeStep !== null ? (
        <BouquetFlowerDetailOverlay
          open
          bouquetTypeKey={bouquetTypeKey}
          step={activeStep}
          title={activeTitle}
          receiverName={receiverName}
          token={token}
          questionId={activeQuestionId}
          onClose={() => setActiveStep(null)}
        />
      ) : null}
    </main>
  );
}
