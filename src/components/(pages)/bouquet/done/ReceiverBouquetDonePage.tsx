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
import { Switch } from "@/components/Switch";
import type { BouquetTypeKey } from "@/features/bouquet";

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

  // TODO(데이터): 실제 답변 데이터에서 hasOptional 도출. 지금은 query로 임시 제어.
  const hasOptional = searchParams.get("hasOptional") !== "false";

  const [showMessages, setShowMessages] = useState(true);
  const heroSrc = pickHero(bouquetTypeKey, hasOptional, showMessages);

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
    </main>
  );
}
