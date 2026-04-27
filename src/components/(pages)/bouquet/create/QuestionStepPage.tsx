"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import homeIcon from "@/assets/icons/home-icon.svg";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";
import type {
  BouquetAnswerEntry,
  BouquetTypeKey,
  CreateSenderBouquetRequest,
} from "@/features/bouquet";
import {
  BE_QUESTION_IDS_BY_TYPE,
  CLIENT_TO_BE_BOUQUET_TYPE,
} from "@/shared/constants/bouquetBeMapping";
import { getQuestions } from "@/shared/constants/bouquetQuestions";
import { BOUQUET_VISUALS } from "@/shared/constants/bouquetVisuals";
import { useBouquetAnswers } from "@/shared/hooks/useBouquetAnswers";

import QuestionStepper from "./QuestionStepper";

const PAGE_WIDTH = 375;
const TEXTAREA_ROWS = 8;
const TOTAL_STEPS = 5;
const DEFAULT_NICKNAME = "이름";
const DEFAULT_RECIPIENT = "상대방";

const VALID_BOUQUET_KEYS = new Set<BouquetTypeKey>(
  BOUQUET_VISUALS.map((visual) => visual.key),
);
// TODO(BE): 수신자 회원 ID(partnerId) 결정 방식 확정 후 교체.
//   - 발신자가 꽃다발 만들 시점엔 수신자 가입 전이라 회원 ID가 없음.
//   - BE가 placeholder member를 자동 생성하는지, 별도 endpoint로 만들어야 하는지 확인 필요.
const PLACEHOLDER_PARTNER_ID = 0;

const buildSenderPayload = (input: {
  partnerId: number;
  bouquetTypeKey: BouquetTypeKey;
  answers: Record<number, string>;
}): CreateSenderBouquetRequest => {
  const ids = BE_QUESTION_IDS_BY_TYPE[input.bouquetTypeKey];
  const answerEntries: BouquetAnswerEntry[] = ids.required.map(
    (questionId, index) => ({
      questionId,
      content: input.answers[index + 1] ?? "",
    }),
  );

  const optionalContent = (input.answers[TOTAL_STEPS] ?? "").trim();
  const hasOptional = optionalContent.length > 0;
  if (hasOptional) {
    answerEntries.push({
      questionId: ids.optional,
      content: optionalContent,
    });
  }

  return {
    role: "SENDER",
    partnerId: input.partnerId,
    bouquetType: CLIENT_TO_BE_BOUQUET_TYPE[input.bouquetTypeKey],
    requiredQuestionIds: [...ids.required],
    ...(hasOptional ? { optionalQuestionId: ids.optional } : {}),
    answers: answerEntries,
  };
};

export default function QuestionStepPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ step: string }>();

  const stepRaw = Number(params?.step);
  const step = Number.isInteger(stepRaw) ? stepRaw : NaN;
  const nickname = searchParams.get("nickname")?.trim() || DEFAULT_NICKNAME;
  const recipient = searchParams.get("recipient")?.trim() || DEFAULT_RECIPIENT;
  const bouquetTypeRaw = searchParams.get("bouquetType")?.trim() ?? "";
  const bouquetTypeKey = VALID_BOUQUET_KEYS.has(
    bouquetTypeRaw as BouquetTypeKey,
  )
    ? (bouquetTypeRaw as BouquetTypeKey)
    : null;

  const isValid =
    Number.isInteger(step) &&
    step >= 1 &&
    step <= TOTAL_STEPS &&
    bouquetTypeKey !== null;

  useEffect(() => {
    if (!isValid) router.replace("/bouquet/create");
  }, [isValid, router]);

  const { answers, setAnswer, clearAnswers } = useBouquetAnswers();

  const visual = useMemo(
    () =>
      bouquetTypeKey
        ? BOUQUET_VISUALS.find((v) => v.key === bouquetTypeKey)
        : undefined,
    [bouquetTypeKey],
  );
  const questions = useMemo(
    () => (bouquetTypeKey ? getQuestions(bouquetTypeKey) : []),
    [bouquetTypeKey],
  );
  const question = questions[step - 1];

  if (!isValid || !visual || !question || !bouquetTypeKey) return null;

  const value = answers[step] ?? "";
  const isOptional = Boolean(question.optional);
  const isFilled = value.trim().length > 0;

  const queryString = new URLSearchParams({
    nickname,
    recipient,
    bouquetType: bouquetTypeKey,
  }).toString();

  const goToStep = (next: number) =>
    router.push(`/bouquet/create/questions/${next}?${queryString}`);

  const submit = (overrideAnswers?: Record<number, string>) => {
    const payload = buildSenderPayload({
      partnerId: PLACEHOLDER_PARTNER_ID,
      bouquetTypeKey,
      answers: overrideAnswers ?? answers,
    });
    // TODO(BE): 현재 BE의 POST /api/v1/bouquets/sender 라우트가 single slash로 등록되어 있지 않아
    //   호출 시 404가 발생합니다. BE에서 슬래시 정정되면 아래 mutation 호출 활성화하기.
    //   const response = await createBouquet.mutateAsync(payload);
    //   const bouquetId = response?.data?.bouquetId;
    if (process.env.NODE_ENV === "development") {
      console.info("[bouquet/create] submit payload (BE 연동 대기)", payload);
    }
    clearAnswers();
    router.push(`/bouquet/create/share?${queryString}`);
  };

  const handleNext = () => {
    if (!isFilled) return;
    if (step >= TOTAL_STEPS) {
      submit();
    } else {
      goToStep(step + 1);
    }
  };

  const handleSkip = () => {
    submit({ ...answers, [step]: "" });
  };

  const backHref =
    step === 1
      ? `/bouquet/create/type?${queryString}`
      : `/bouquet/create/questions/${step - 1}?${queryString}`;

  return (
    <main
      className="mx-auto flex min-h-dvh flex-col bg-[#fafafa]"
      style={{ width: PAGE_WIDTH }}
    >
      <header className="flex items-center justify-between p-4">
        <Link
          href={backHref}
          aria-label="이전으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={chevronLeftIcon} alt="" aria-hidden />
        </Link>
        <Link
          href="/"
          aria-label="홈으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={homeIcon} alt="" aria-hidden />
        </Link>
      </header>

      <section className="flex flex-1 flex-col">
        <div className="flex flex-col gap-[30px]">
          <div className="flex flex-col">
            <QuestionStepper
              currentStep={step}
              accentColor={visual.accentColor}
            />
            <div className="flex flex-col gap-1 p-5">
              {isOptional ? (
                <p className="typo-body-3 text-[var(--color-gray-300)]">
                  (선택형 질문)
                </p>
              ) : null}
              <p
                className="typo-title-2 flex flex-wrap items-end gap-[6px]"
                style={{ lineHeight: "30px" }}
              >
                <span className="whitespace-nowrap">
                  <span className="text-[var(--color-red-300)]">
                    {nickname}
                  </span>
                  <span className="text-[var(--color-brown-300)]">님이 </span>
                </span>
                <span className="whitespace-nowrap text-[var(--color-brown-300)]">
                  {recipient}
                  {question.recipientLine}
                </span>
              </p>
              <p
                className="typo-title-2 text-[var(--color-brown-300)]"
                style={{ lineHeight: "30px" }}
              >
                {question.body}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-5">
            <p className="typo-body-3 whitespace-nowrap text-[var(--color-green-400)]">
              <span>To. </span>
              <span>{recipient}</span>
            </p>
            <TextArea
              value={value}
              onChange={(event) => setAnswer(step, event.target.value)}
              placeholder={
                isOptional
                  ? "자유롭게 작성해 주세요."
                  : "작은 거여도 괜찮아요, 생각나는 대로 적어보세요."
              }
              rows={TEXTAREA_ROWS}
            />
            <p className="typo-body-3 text-[var(--color-gray-200)]">
              진심이 담긴 따뜻한 마음을 담아 꽃다발을 만들어 봐요.
            </p>
          </div>
        </div>

        <div className="mt-auto bg-gradient-to-b from-transparent to-white p-5">
          {isOptional ? (
            <div className="flex gap-2">
              <Button
                variant="outlined"
                onClick={handleSkip}
                className="h-12 flex-1 whitespace-nowrap px-3"
              >
                넘기기
              </Button>
              <Button
                variant="solid"
                disabled={!isFilled}
                onClick={handleNext}
                className="h-12 flex-1 whitespace-nowrap px-3"
              >
                이벤트 꽃 추가하기
              </Button>
            </div>
          ) : (
            <Button
              variant="solid"
              disabled={!isFilled}
              onClick={handleNext}
              className="h-12 w-full"
            >
              {step}번째 꽃 추가하기
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
