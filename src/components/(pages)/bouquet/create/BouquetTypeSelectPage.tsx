"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import { Button } from "@/components/Button";
import { useBouquetTypesQuery, type BouquetType } from "@/features/bouquet";
import {
  BOUQUET_VISUALS,
  type BouquetVisual,
} from "@/shared/constants/bouquetVisuals";

const PAGE_WIDTH = 375;
const HERO_CIRCLE_SIZE = 217;
const HERO_ROW_HEIGHT = 222;
const HERO_FLOWER_HEIGHT = 218;
const HERO_FLOWER_TOP_OFFSET = -11;
const THUMB_SIZE = 76;
const DEFAULT_SELECTED_INDEX = 0;

const THUMB_FLOWER_LAYOUT: Partial<
  Record<
    BouquetVisual["key"],
    { width: number; height: number; left: number; top: number }
  >
> = {
  YELLOW_TULIP: { width: 42.764, height: 53.914, left: 12.5, top: 10 },
  BLUE_LILY: { width: 71.094, height: 48, left: 3, top: 17 },
};

type BouquetCard = {
  visual: BouquetVisual;
  beId: number;
  name: string;
  description: string;
};

// BOUQUET_VISUALS의 beId를 우선 신뢰하되, BE 응답이 같은 id로 내려오면 이름/설명만 덮어씀.
const mergeWithVisuals = (types: BouquetType[] | undefined): BouquetCard[] =>
  BOUQUET_VISUALS.map((visual) => {
    const match = types?.find((t) => t.id === visual.beId);
    return {
      visual,
      beId: visual.beId,
      name: match?.bouquetName ?? visual.fallbackName,
      description: match?.bouquetDescription ?? visual.fallbackDescription,
    };
  });

const DEFAULT_NICKNAME = "이름";

export default function BouquetTypeSelectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nickname = searchParams.get("nickname")?.trim() || DEFAULT_NICKNAME;
  const recipient = searchParams.get("recipient")?.trim() ?? "";

  const [selectedIndex, setSelectedIndex] = useState(DEFAULT_SELECTED_INDEX);
  const { data: types } = useBouquetTypesQuery();

  const cards = useMemo(() => mergeWithVisuals(types), [types]);
  const selected = cards[selectedIndex] ?? cards[DEFAULT_SELECTED_INDEX];

  const recipientQuery = recipient
    ? `&recipient=${encodeURIComponent(recipient)}`
    : "";

  const handleNext = () => {
    if (!selected) return;
    router.push(
      `/bouquet/create/questions/1?nickname=${encodeURIComponent(nickname)}${recipientQuery}&bouquetType=${selected.visual.key}&bouquetTypeId=${selected.beId}`,
    );
  };

  return (
    <main
      className="mx-auto flex min-h-dvh flex-col bg-[#fafafa]"
      style={{ width: PAGE_WIDTH }}
    >
      <header className="flex items-center px-4 py-4">
        <Link
          href={`/bouquet/create/recipient?nickname=${encodeURIComponent(nickname)}`}
          aria-label="이전으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={chevronLeftIcon} alt="" aria-hidden />
        </Link>
      </header>

      <section className="flex flex-1 flex-col">
        <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
          <h1
            className="typo-title-2 text-[var(--color-brown-300)]"
            style={{ lineHeight: "30px" }}
          >
            어떤 꽃다발로 마음을 전달할까요?
          </h1>
          <p className="typo-body-2 whitespace-pre-line text-[var(--color-brown-200)]">
            {"꽃다발을 고르면 질문이 달라져요.\n어떤 이야기를 나눠볼까요?"}
          </p>
        </div>

        <div
          className="relative mx-auto"
          style={{ width: HERO_CIRCLE_SIZE, height: HERO_ROW_HEIGHT }}
          aria-hidden
        >
          <div
            className="absolute bottom-[5px] left-1/2 -translate-x-1/2 rounded-full shadow-[0_0_20px_rgba(0,0,0,0.08)]"
            style={{
              width: HERO_CIRCLE_SIZE,
              height: HERO_CIRCLE_SIZE,
              backgroundColor: selected.visual.bgColor,
            }}
          />
          {selected.visual.hero ? (
            <Image
              src={selected.visual.hero}
              alt=""
              priority
              className="absolute left-1/2 z-10 -translate-x-1/2"
              style={{
                top: HERO_FLOWER_TOP_OFFSET,
                height: HERO_FLOWER_HEIGHT,
                width: "auto",
              }}
            />
          ) : null}
        </div>

        <div className="flex flex-col items-center gap-2 px-5 py-3">
          <h2
            className="typo-title-2 text-center text-[var(--color-brown-300)]"
            style={{ lineHeight: "30px" }}
          >
            {selected.name}
          </h2>
          <p className="typo-body-2-1 text-center text-[var(--color-brown-100)]">
            {selected.description}
          </p>
        </div>

        <div className="flex items-center justify-center gap-[10px] pb-2 pt-5">
          {cards.map((card, index) => {
            const isSelected = index === selectedIndex;
            const flowerLayout = THUMB_FLOWER_LAYOUT[card.visual.key];
            const hasBuiltinCard = !flowerLayout;
            return (
              <button
                key={card.visual.key}
                type="button"
                aria-pressed={isSelected}
                aria-label={card.name}
                onClick={() => setSelectedIndex(index)}
                className={`relative shrink-0 overflow-clip rounded-xl ${
                  hasBuiltinCard ? "" : "bg-white"
                } ${
                  isSelected
                    ? "border border-[var(--color-green-400)] shadow-[0_0_12px_0_rgba(69,48,48,0.12)]"
                    : ""
                }`}
                style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
              >
                {flowerLayout ? (
                  <Image
                    src={card.visual.thumbnail}
                    alt=""
                    width={Math.round(flowerLayout.width)}
                    height={Math.round(flowerLayout.height)}
                    className="absolute max-w-none"
                    style={{
                      left: flowerLayout.left,
                      top: flowerLayout.top,
                      width: flowerLayout.width,
                      height: flowerLayout.height,
                    }}
                  />
                ) : (
                  <Image
                    src={card.visual.thumbnail}
                    alt=""
                    width={THUMB_SIZE}
                    height={THUMB_SIZE}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-auto bg-linear-to-b from-transparent to-white p-5">
          <Button variant="solid" onClick={handleNext} className="h-12 w-full">
            꽃다발 만들기
          </Button>
        </div>
      </section>
    </main>
  );
}
