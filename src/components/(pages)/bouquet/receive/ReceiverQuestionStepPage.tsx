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
  useBouquetByLinkQuery,
  useBouquetLinkQuestionsQuery,
  useCompleteBouquetMutation,
  type BouquetLinkQuestion,
  type CreateBouquetAnswer,
} from "@/features/bouquet";
import {
  mapQuestionsByQuestionIds,
} from "@/shared/constants/bouquetQuestions";
import { useSessionState } from "@/shared/hooks/useSessionState";
import QuestionStepper from "@/components/(pages)/bouquet/create/QuestionStepper";

const TEXTAREA_ROWS = 8;
const PAGE_WIDTH = 375;

type ReceiverAnswers = Record<number, string>;

const getAnswersStorageKey = (token: string) => `bouquetReceive.answers.${token}`;

const isOptionalQuestion = (question: BouquetLinkQuestion) =>
  question.answerType === "OPTIONAL";

const normalizeQuestions = (questions: BouquetLinkQuestion[] | undefined) => {
  if (!questions) {
    return [];
  }

  return [...questions].sort((a, b) => {
    const aSort = a.sortOrder ?? Number.MAX_SAFE_INTEGER;
    const bSort = b.sortOrder ?? Number.MAX_SAFE_INTEGER;
    return aSort - bSort;
  });
};

export default function ReceiverQuestionStepPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams<{ token: string; step: string }>();
  const token = params.token;
  const step = Number(params.step);
  const receiverName = searchParams.get("receiverName")?.trim() ?? "";

  const [answers, setAnswers] = useSessionState<ReceiverAnswers>(
    getAnswersStorageKey(token),
    {},
  );

  const { data: bouquetInfo } = useBouquetByLinkQuery(token);
  const senderName = bouquetInfo?.senderName?.trim() || "보낸 분";
  const { data: questionData, isPending: isQuestionsPending } =
    useBouquetLinkQuestionsQuery(token);
  const questions = useMemo(() => normalizeQuestions(questionData), [questionData]);
  const mappedQuestions = useMemo(
    () => mapQuestionsByQuestionIds(questions.map((item) => item.questionId)),
    [questions],
  );

  const completeBouquet = useCompleteBouquetMutation();
  const totalSteps = questions.length;
  const isStepValid = Number.isInteger(step) && step >= 1 && step <= totalSteps;
  const question = isStepValid ? questions[step - 1] : undefined;
  const mappedQuestion = isStepValid ? mappedQuestions?.[step - 1] : undefined;
  const displayQuestionTitle = mappedQuestion?.body ?? question?.title ?? "";
  const displayRecipientLine = mappedQuestion?.recipientLine ?? "에게";
  const value = answers[step] ?? "";
  const isFilled = value.trim().length > 0;
  const isOptional = question ? isOptionalQuestion(question) : false;

  useEffect(() => {
    if (!receiverName) {
      router.replace(`/bouquet/${token}/nickname`);
      return;
    }

    if (!isQuestionsPending && totalSteps > 0 && !isStepValid) {
      router.replace(`/bouquet/${token}/questions/1?receiverName=${encodeURIComponent(receiverName)}`);
    }
  }, [isQuestionsPending, isStepValid, receiverName, router, token, totalSteps]);

  if (!question || !receiverName) {
    return null;
  }

  const queryString = new URLSearchParams({
    receiverName,
  }).toString();

  const backHref =
    step === 1
      ? `/bouquet/${token}/nickname`
      : `/bouquet/${token}/questions/${step - 1}?${queryString}`;

  const buildPayloadAnswers = (): {
    entries: CreateBouquetAnswer[];
    hasOptionalAnswer: boolean;
  } | null => {
    let hasOptionalAnswer = false;

    const entries = questions.reduce<CreateBouquetAnswer[]>((acc, item, index) => {
      const currentStep = index + 1;
      const answer = (answers[currentStep] ?? "").trim();

      if (!answer && !isOptionalQuestion(item)) {
        return acc;
      }

      if (!answer) {
        return acc;
      }

      if (isOptionalQuestion(item)) {
        hasOptionalAnswer = true;
      }

      acc.push({
        questionId: item.questionId,
        answerType: "SUBJECTIVE",
        answer,
        sortOrder: currentStep,
      });
      return acc;
    }, []);

    const requiredCount = questions.filter((item) => !isOptionalQuestion(item)).length;
    if (entries.length < requiredCount) {
      return null;
    }

    return { entries, hasOptionalAnswer };
  };

  const goToNextStep = () => {
    router.push(`/bouquet/${token}/questions/${step + 1}?${queryString}`);
  };

  const submit = async () => {
    const payloadAnswers = buildPayloadAnswers();

    if (!payloadAnswers) {
      toast("필수 질문에 먼저 답변해 주세요.");
      return;
    }

    try {
      await completeBouquet.mutateAsync({
        token,
        payload: {
          receiverName,
          answers: payloadAnswers.entries,
        },
      });

      setAnswers({});

      const query = new URLSearchParams({
        token,
        senderName,
        receiverName,
        hasOptional: payloadAnswers.hasOptionalAnswer ? "true" : "false",
      });
      router.push(`/bouquet/receive/packing?${query.toString()}`);
    } catch (error) {
      console.error(error);
      toast("답변 저장에 실패했어요. 다시 시도해 주세요.");
    }
  };

  const handleNext = () => {
    if (!isFilled || completeBouquet.isPending) {
      return;
    }

    if (step >= totalSteps) {
      void submit();
      return;
    }

    goToNextStep();
  };

  const handleSkip = () => {
    if (completeBouquet.isPending) {
      return;
    }

    setAnswers((prev) => ({ ...prev, [step]: "" }));

    if (step >= totalSteps) {
      void submit();
      return;
    }

    goToNextStep();
  };

  const nextButtonLabel =
    step === totalSteps ? "꽃다발 완성하기" : `${step}번째 꽃 추가하기`;

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
              accentColor="var(--color-red-400)"
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
                    {receiverName}
                  </span>
                  <span className="text-[var(--color-brown-300)]">님이 </span>
                </span>
                <span className="whitespace-nowrap text-[var(--color-brown-300)]">
                  {senderName}님{displayRecipientLine}
                </span>
              </p>
              <p
                className="typo-title-2 whitespace-pre-line text-[var(--color-brown-300)]"
                style={{ lineHeight: "30px" }}
              >
                {displayQuestionTitle}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 px-5">
          <p className="typo-body-3 text-[var(--color-green-400)]">
            To. {senderName}
          </p>
          <TextArea
            value={value}
            onChange={(event) =>
              setAnswers((prev) => ({ ...prev, [step]: event.target.value }))
            }
            rows={TEXTAREA_ROWS}
            placeholder={
              isOptional
                ? "자유롭게 작성해 주세요."
                : "작은 거여도 괜찮아요, 생각나는 대로 적어보세요."
            }
          />
          <p className="typo-body-3 text-[var(--color-gray-200)]">
            정성껏 답변을 남겨 꽃다발을 완성해요.
          </p>
        </div>

        <div className="mt-auto bg-gradient-to-b from-transparent to-white p-5">
          {isOptional ? (
            <div className="flex gap-2">
              <Button
                variant="outlined"
                className="h-12 flex-1 whitespace-nowrap px-3"
                onClick={handleSkip}
                disabled={completeBouquet.isPending}
              >
                넘기기
              </Button>
              <Button
                className="h-12 flex-1 whitespace-nowrap px-3"
                onClick={handleNext}
                disabled={!isFilled || completeBouquet.isPending}
              >
                {nextButtonLabel}
              </Button>
            </div>
          ) : (
            <Button
              className="h-12 w-full"
              onClick={handleNext}
              disabled={!isFilled || completeBouquet.isPending}
            >
              {nextButtonLabel}
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
