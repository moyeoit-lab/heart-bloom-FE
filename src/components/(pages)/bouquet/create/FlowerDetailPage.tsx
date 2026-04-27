"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import { TextArea } from "@/components/TextArea";
import type { BouquetTypeKey } from "@/features/bouquet";
import { getQuestionByStep } from "@/shared/constants/bouquetQuestions";
import { BOUQUET_VISUALS } from "@/shared/constants/bouquetVisuals";
import { useBouquetAnswers } from "@/shared/hooks/useBouquetAnswers";

const PAGE_WIDTH = 375;
const TEXTAREA_ROWS = 8;
const REQUIRED_STEPS = 4;
const DEFAULT_NICKNAME = "이름";
const DEFAULT_RECIPIENT = "상대방";

const VALID_BOUQUET_KEYS = new Set<BouquetTypeKey>(
  BOUQUET_VISUALS.map((visual) => visual.key),
);

// 꽃 detail 페이지 배경은 PackingDonePage와 동일한 그라디언트.
// TODO(자산): 디자이너로부터 꽃 아이콘(꽃다발×4 = 16개) 받기 전엔 accentColor 원형 placeholder 사용.
const FLOWER_BG_BY_TYPE: Record<BouquetTypeKey, string> = {
  YELLOW_TULIP: "bg-gradient-to-b from-[#fff3c0] to-[#fffadf]",
  RED_CARNATION:
    "bg-gradient-to-b from-[#ffa2a8] via-[#ffe3c3] via-[71.272%] to-[#fffed7] to-[138.55%]",
  BLUE_LILY: "bg-gradient-to-t from-[#e8f0d2] to-[#79c0ff] to-[112.41%]",
  PINK_GERBERA: "bg-gradient-to-t from-[#feffd7] to-[#ffd0db] to-[112.41%]",
};

export default function FlowerDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ step: string }>();

  const stepRaw = Number(params?.step);
  const step = Number.isInteger(stepRaw) ? stepRaw : NaN;
  const nickname = searchParams.get("nickname")?.trim() || DEFAULT_NICKNAME;
  const recipient = searchParams.get("recipient")?.trim() || DEFAULT_RECIPIENT;
  const bouquetTypeRaw = searchParams.get("bouquetType")?.trim() ?? "";
  const bouquetTypeKey = VALID_BOUQUET_KEYS.has(bouquetTypeRaw as BouquetTypeKey)
    ? (bouquetTypeRaw as BouquetTypeKey)
    : null;

  const isValid =
    Number.isInteger(step) &&
    step >= 1 &&
    step <= REQUIRED_STEPS &&
    bouquetTypeKey !== null;

  useEffect(() => {
    if (!isValid) router.replace("/bouquet/create");
  }, [isValid, router]);

  const { answers } = useBouquetAnswers();

  const visual = useMemo(
    () =>
      bouquetTypeKey
        ? BOUQUET_VISUALS.find((v) => v.key === bouquetTypeKey)
        : undefined,
    [bouquetTypeKey],
  );
  const question = bouquetTypeKey
    ? getQuestionByStep(bouquetTypeKey, step)
    : undefined;

  if (!isValid || !visual || !question || !bouquetTypeKey) return null;

  const senderAnswer = answers[step] ?? "";
  const bgClass = FLOWER_BG_BY_TYPE[bouquetTypeKey];

  // TODO: 수신자 답변 상태 = BE 연동 후 GET /api/v1/bouquets/links/{token} 응답으로 결정.
  //   현재는 항상 "공유 전(잠금)" 상태로 표시.
  const isRecipientAnswered = false;
  const recipientAnswer = "";

  const queryString = searchParams.toString();
  const backHref = `/bouquet/create/done?${queryString}`;

  return (
    <main
      className={`mx-auto flex min-h-dvh flex-col ${bgClass}`}
      style={{ width: PAGE_WIDTH }}
    >
      <header className="flex items-center px-4 py-4">
        <Link
          href={backHref}
          aria-label="이전으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={chevronLeftIcon} alt="" aria-hidden />
        </Link>
      </header>

      <section className="flex flex-col items-center gap-3 px-5 pb-6">
        <div
          aria-hidden
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ backgroundColor: visual.bgColor }}
        >
          <span
            className="block h-12 w-12 rounded-full"
            style={{ backgroundColor: visual.accentColor }}
          />
        </div>
        <h1 className="typo-title-3 text-center text-[var(--color-brown-300)]">
          {question.subjectTitle}
        </h1>
      </section>

      <section className="flex flex-col gap-2 px-5">
        <p className="typo-body-3 whitespace-nowrap text-[var(--color-green-400)]">
          <span>To. 상대방</span>
        </p>
        <TextArea
          value={senderAnswer}
          readOnly
          rows={TEXTAREA_ROWS}
          placeholder=""
        />
      </section>

      <section className="relative mt-6 flex flex-col gap-2 px-5 pb-10">
        <div
          className={
            isRecipientAnswered ? "flex flex-col gap-2" : "flex flex-col gap-2 blur-[3px]"
          }
        >
          <p className="typo-body-3 whitespace-nowrap text-[var(--color-gray-300)]">
            <span>To. </span>
            <span>{nickname}</span>
          </p>
          <TextArea
            value={recipientAnswer}
            readOnly
            rows={TEXTAREA_ROWS}
            placeholder=""
          />
        </div>
        {isRecipientAnswered ? null : (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-5">
            <p className="typo-body-1 text-[var(--color-gray-500)]">
              상대방이 답변하면 확인할 수 있어요
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
