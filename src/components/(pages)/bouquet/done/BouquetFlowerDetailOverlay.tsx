"use client";

import Image from "next/image";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import { TextArea } from "@/components/TextArea";
import {
  useBouquetQuestionAnswersQuery,
  type BouquetTypeKey,
} from "@/features/bouquet";
import { pickQuestionFlowerIcon } from "@/shared/constants/questionFlowerIcons";

const PAGE_WIDTH = 375;
const ICON_SIZE = 67;
const ICON_TOP = 81;
const TITLE_TOP = 161;
const SENDER_BLOCK_TOP = 209;
const RECEIVER_BLOCK_TOP = 520;
const TEXTAREA_ROWS = 8;

// 모달 배경 그라디언트 — Figma 수신자 모달 노드 기준.
const BG_BY_TYPE: Record<BouquetTypeKey, string> = {
  YELLOW_TULIP:
    "bg-gradient-to-b from-[#fef2bf] via-[#fffadf] via-[51.923%] to-[#e4eecf]",
  PINK_GERBERA: "bg-gradient-to-t from-[#feffd7] to-[#ffd0db] to-[112.41%]",
  RED_CARNATION:
    "bg-gradient-to-b from-[#ffa2a8] via-[#ffe3c3] via-[51.923%] to-[#fffed7]",
  BLUE_LILY: "bg-gradient-to-t from-[#e8f0d2] to-[#79c0ff] to-[112.41%]",
};

type Props = {
  open: boolean;
  bouquetTypeKey: BouquetTypeKey;
  step: number;
  title: string;
  receiverName: string;
  /** 수신자 done 진입 시 URL 토큰. 있으면 BE에서 답변 fetch, 없으면 placeholder. */
  token: string | undefined;
  /** BE의 questionId. (꽃다발 타입, step) 매핑은 [bouquetQuestions.ts]에 있음. */
  questionId: number | undefined;
  onClose: () => void;
};

export default function BouquetFlowerDetailOverlay({
  open,
  bouquetTypeKey,
  step,
  title,
  receiverName,
  token,
  questionId,
  onClose,
}: Props) {
  // 훅은 항상 호출하되 enabled 가드로 token/questionId 없으면 fetch 건너뜀.
  const { data: questionAnswers } = useBouquetQuestionAnswersQuery(
    token,
    questionId,
  );

  if (!open) return null;

  const iconSrc = pickQuestionFlowerIcon(bouquetTypeKey, step);
  const senderAnswer = questionAnswers?.senderAnswer?.subjectiveContent ?? "";
  const receiverAnswer =
    questionAnswers?.receiverAnswer?.subjectiveContent ?? "";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className={`fixed inset-0 z-50 mx-auto overflow-y-auto ${BG_BY_TYPE[bouquetTypeKey]}`}
      style={{ width: PAGE_WIDTH }}
    >
      <div
        className="relative"
        style={{ width: PAGE_WIDTH, minHeight: "100dvh" }}
      >
        <header className="flex items-center p-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="이전으로 돌아가기"
            className="flex h-6 w-6 items-center justify-center"
          >
            <Image
              src={chevronLeftIcon}
              alt=""
              aria-hidden
              width={24}
              height={24}
            />
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
