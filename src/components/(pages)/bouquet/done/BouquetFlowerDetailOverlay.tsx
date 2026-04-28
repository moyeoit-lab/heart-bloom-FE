"use client";

import Image from "next/image";
import type { StaticImageData } from "next/image";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import paperIcon from "@/assets/images/bouquet-done/paper.svg";
import blueQ1 from "@/assets/images/bouquets/blue-flower-question-1.svg";
import blueQ2 from "@/assets/images/bouquets/blue-flower-question-2.svg";
import blueQ3 from "@/assets/images/bouquets/blue-flower-question-3.svg";
import blueQ4 from "@/assets/images/bouquets/blue-flower-question-4.svg";
import pinkQ1 from "@/assets/images/bouquets/pink-flower-question-1.svg";
import pinkQ2 from "@/assets/images/bouquets/pink-flower-question-2.svg";
import pinkQ3 from "@/assets/images/bouquets/pink-flower-question-3.svg";
import pinkQ4 from "@/assets/images/bouquets/pink-flower-question-4.svg";
import redQ1 from "@/assets/images/bouquets/red-flower-question-1.svg";
import redQ2 from "@/assets/images/bouquets/red-flower-question-2.svg";
import redQ3 from "@/assets/images/bouquets/red-flower-question-3.svg";
import redQ4 from "@/assets/images/bouquets/red-flower-question-4.svg";
import yellowQ1 from "@/assets/images/bouquets/yellow-flower-qustion-1.svg";
import yellowQ2 from "@/assets/images/bouquets/yellow-flower-qustion-2.svg";
import yellowQ3 from "@/assets/images/bouquets/yellow-flower-qustion-3.svg";
import yellowQ4 from "@/assets/images/bouquets/yellow-flower-qustion-4.svg";
import { TextArea } from "@/components/TextArea";
import type { BouquetTypeKey } from "@/features/bouquet";

const PAGE_WIDTH = 375;
const ICON_SIZE = 67;
const ICON_TOP = 81;
const TITLE_TOP = 161;
const SENDER_BLOCK_TOP = 209;
const RECEIVER_BLOCK_TOP = 520;
const TEXTAREA_ROWS = 8;
const NOTE_STEP = 5;

type FlowerIconMap = Record<1 | 2 | 3 | 4, StaticImageData>;

const FLOWER_ICONS_BY_TYPE: Partial<Record<BouquetTypeKey, FlowerIconMap>> = {
  YELLOW_TULIP: {
    1: yellowQ1,
    2: yellowQ2,
    3: yellowQ3,
    4: yellowQ4,
  },
  PINK_GERBERA: {
    1: pinkQ3,
    2: pinkQ4,
    3: pinkQ2,
    4: pinkQ1,
  },
  RED_CARNATION: {
    1: redQ4,
    2: redQ2,
    3: redQ3,
    4: redQ1,
  },
  BLUE_LILY: {
    1: blueQ3,
    2: blueQ4,
    3: blueQ1,
    4: blueQ2,
  },
};

// 모달 배경 그라디언트 — Figma 수신자 모달 노드 기준.
const BG_BY_TYPE: Record<BouquetTypeKey, string> = {
  YELLOW_TULIP:
    "bg-gradient-to-b from-[#fef2bf] via-[#fffadf] via-[51.923%] to-[#e4eecf]",
  PINK_GERBERA: "bg-gradient-to-t from-[#feffd7] to-[#ffd0db] to-[112.41%]",
  RED_CARNATION:
    "bg-gradient-to-b from-[#ffa2a8] via-[#ffe3c3] via-[51.923%] to-[#fffed7]",
  BLUE_LILY: "bg-gradient-to-t from-[#e8f0d2] to-[#79c0ff] to-[112.41%]",
};

const pickIcon = (
  bouquetTypeKey: BouquetTypeKey,
  step: number,
): StaticImageData => {
  if (step === NOTE_STEP) return paperIcon;
  const map = FLOWER_ICONS_BY_TYPE[bouquetTypeKey];
  if (!map) return paperIcon;
  return map[step as 1 | 2 | 3 | 4] ?? paperIcon;
};

type Props = {
  open: boolean;
  bouquetTypeKey: BouquetTypeKey;
  step: number;
  title: string;
  receiverName: string;
  senderAnswer: string;
  receiverAnswer: string;
  onClose: () => void;
};

export default function BouquetFlowerDetailOverlay({
  open,
  bouquetTypeKey,
  step,
  title,
  receiverName,
  senderAnswer,
  receiverAnswer,
  onClose,
}: Props) {
  if (!open) return null;

  const iconSrc = pickIcon(bouquetTypeKey, step);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-50 mx-auto overflow-y-auto ${BG_BY_TYPE[bouquetTypeKey]}`}
      style={{ width: PAGE_WIDTH }}
    >
      <div className="relative" style={{ width: PAGE_WIDTH, minHeight: "100dvh" }}>
        <header className="flex items-center p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="이전으로 돌아가기"
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image src={chevronLeftIcon} alt="" aria-hidden width={24} height={24} />
          </button>
        </header>

        <div
          aria-hidden
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: ICON_TOP, width: ICON_SIZE, height: ICON_SIZE }}
        >
          <Image src={iconSrc} alt="" fill sizes={`${ICON_SIZE}px`} />
        </div>

        <div
          className="absolute left-0 right-0 px-5 text-center"
          style={{ top: TITLE_TOP }}
        >
          <h1 className="font-kimm whitespace-nowrap text-[24px] leading-[40px] font-bold tracking-[-2.257px] text-(--color-brown-300)">
            {title}
          </h1>
        </div>

        <section
          className="absolute left-0 flex flex-col gap-2 p-5"
          style={{ top: SENDER_BLOCK_TOP, width: PAGE_WIDTH }}
        >
          <p className="typo-body-3 whitespace-nowrap text-(--color-green-400)">
            <span>To. 상대방</span>
          </p>
          <TextArea
            value={senderAnswer}
            readOnly
            rows={TEXTAREA_ROWS}
            placeholder=""
          />
        </section>

        <section
          className="absolute left-0 flex flex-col gap-2 p-5"
          style={{ top: RECEIVER_BLOCK_TOP, width: PAGE_WIDTH }}
        >
          <p className="typo-body-3 whitespace-nowrap text-(--color-green-400)">
            <span>To. </span>
            <span>{receiverName}</span>
          </p>
          <TextArea
            value={receiverAnswer}
            readOnly
            rows={TEXTAREA_ROWS}
            placeholder=""
          />
        </section>
      </div>
    </div>
  );
}
