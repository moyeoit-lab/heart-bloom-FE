"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import homeIcon from "@/assets/icons/home-icon.svg";
import { Button } from "@/components/Button";
import { TextArea } from "@/components/TextArea";
import { toast } from "@/components/Toast";
import {
  useCreateBouquetMutation,
  useLandingQuestionsQuery,
  type BouquetTypeKey,
  type CreateBouquetAnswer,
  type CreateBouquetRequest,
  type LandingQuestion,
} from "@/features/bouquet";
import { getQuestions } from "@/shared/constants/bouquetQuestions";
import { BOUQUET_VISUALS } from "@/shared/constants/bouquetVisuals";
import { useBouquetAnswers } from "@/shared/hooks/useBouquetAnswers";
import { useBouquetCreationResult } from "@/shared/hooks/useBouquetCreationResult";

import QuestionStepper from "./QuestionStepper";

const PAGE_WIDTH = 375;
const TEXTAREA_ROWS = 8;
const TOTAL_STEPS = 5;
const DEFAULT_NICKNAME = "이름";
const DEFAULT_RECIPIENT = "상대방";

const VALID_BOUQUET_KEYS = new Set<BouquetTypeKey>(
  BOUQUET_VISUALS.map((visual) => visual.key),
);

// step(1..5) → questionId.
// landing questions 응답이 sortOrder 순으로 정렬돼 있다고 가정하고 인덱스로 매칭.
const buildQuestionIdByStep = (
  questions: LandingQuestion[] | undefined,
): Record<number, number> => {
  if (!questions) return {};
  const map: Record<number, number> = {};
  for (let i = 0; i < TOTAL_STEPS; i += 1) {
    const q = questions[i];
    if (q?.questionId !== undefined) map[i + 1] = q.questionId;
  }
  return map;
};

const buildCreateBouquetPayload = (input: {
  displayName: string;
  relationName: string;
  bouquetTypeId: number;
  answers: Record<number, string>;
  questionIdByStep: Record<number, number>;
}): CreateBouquetRequest => {
  const entries: CreateBouquetAnswer[] = Array.from(
    { length: TOTAL_STEPS },
    (_, index): CreateBouquetAnswer | null => {
      const step = index + 1;
      const questionId = input.questionIdByStep[step];
      if (questionId === undefined) return null;
      const answer = input.answers[step] ?? "";
      if (answer.trim().length === 0) return null;
      return {
        questionId,
        // 메모리 컨벤션: 모든 질문 주관식 고정.
        answerType: "SUBJECTIVE",
        answer,
        sortOrder: step,
      };
    },
  ).filter((entry): entry is CreateBouquetAnswer => entry !== null);

  return {
    displayName: input.displayName,
    relationName: input.relationName,
    bouquetTypeId: input.bouquetTypeId,
    answers: entries,
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
  const bouquetTypeIdRaw = Number(searchParams.get("bouquetTypeId"));
  const bouquetTypeId =
    Number.isInteger(bouquetTypeIdRaw) && bouquetTypeIdRaw > 0
      ? bouquetTypeIdRaw
      : null;

  const isValid =
    Number.isInteger(step) &&
    step >= 1 &&
    step <= TOTAL_STEPS &&
    bouquetTypeKey !== null &&
    bouquetTypeId !== null;

  useEffect(() => {
    if (!isValid) router.replace("/bouquet/create");
  }, [isValid, router]);

  const { answers, setAnswer } = useBouquetAnswers();
  const { setResult } = useBouquetCreationResult();
  const { data: landingQuestions } = useLandingQuestionsQuery();
  const createBouquet = useCreateBouquetMutation();

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
  const questionIdByStep = useMemo(
    () => buildQuestionIdByStep(landingQuestions),
    [landingQuestions],
  );
  const question = questions[step - 1];

  if (!isValid || !visual || !question || !bouquetTypeKey || !bouquetTypeId)
    return null;

  const value = answers[step] ?? "";
  const isOptional = Boolean(question.optional);
  const isFilled = value.trim().length > 0;
  const isSubmitting = createBouquet.isPending;

  const queryString = new URLSearchParams({
    nickname,
    recipient,
    bouquetType: bouquetTypeKey,
    bouquetTypeId: String(bouquetTypeId),
  }).toString();

  const goToStep = (next: number) =>
    router.push(`/bouquet/create/questions/${next}?${queryString}`);

  const submit = async (overrideAnswers?: Record<number, string>) => {
    const payload = buildCreateBouquetPayload({
      displayName: nickname,
      relationName: recipient,
      bouquetTypeId,
      answers: overrideAnswers ?? answers,
      questionIdByStep,
    });

    if (payload.answers.length === 0) {
      console.warn("[bouquet/create] empty payload.answers", {
        landingQuestions,
        questionIdByStep,
        answersInState: overrideAnswers ?? answers,
      });
      toast("질문 정보를 불러오지 못했어요. 잠시 후 다시 시도해 주세요.");
      return;
    }

    try {
      const response = await createBouquet.mutateAsync(payload);
      const bouquetId = response?.data?.bouquetId;
      const linkToken = response?.data?.linkToken;
      if (!bouquetId || !linkToken) {
        toast("꽃다발 생성에 실패했어요. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setResult({ bouquetId, linkToken });
      router.push(`/bouquet/create/packing?${queryString}`);
    } catch (error) {
      console.error(error);
      toast("꽃다발 생성에 실패했어요. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleNext = () => {
    if (!isFilled || isSubmitting) return;
    if (step >= TOTAL_STEPS) {
      void submit();
    } else {
      goToStep(step + 1);
    }
  };

  const handleSkip = () => {
    if (isSubmitting) return;
    void submit({ ...answers, [step]: "" });
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
                  상대방
                  {question.recipientLine}
                </span>
              </p>
              <p
                className="typo-title-2 whitespace-pre-line text-[var(--color-brown-300)]"
                style={{ lineHeight: "30px" }}
              >
                {question.body}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 px-5">
            <p className="typo-body-3 whitespace-nowrap text-[var(--color-green-400)]">
              <span>To. 상대방</span>
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
                disabled={isSubmitting}
                className="h-12 flex-1 whitespace-nowrap px-3"
              >
                넘기기
              </Button>
              <Button
                variant="solid"
                disabled={!isFilled || isSubmitting}
                onClick={handleNext}
                className="h-12 flex-1 whitespace-nowrap px-3"
              >
                이벤트 꽃 추가하기
              </Button>
            </div>
          ) : (
            <Button
              variant="solid"
              disabled={!isFilled || isSubmitting}
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
