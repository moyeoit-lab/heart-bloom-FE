import type { BouquetTypeKey } from "@/features/bouquet/types";

export type QuestionSubjectKey =
  | "GRATITUDE"
  | "OUR_MOMENTS"
  | "EMOTIONS"
  | "INNER_THOUGHTS";

export type Question = {
  step: number;
  recipientLine: string;
  body: string;
  optional?: boolean;
};

export const BOUQUET_TO_SUBJECT: Record<BouquetTypeKey, QuestionSubjectKey> = {
  RED_CARNATION: "GRATITUDE",
  YELLOW_TULIP: "OUR_MOMENTS",
  BLUE_LILY: "EMOTIONS",
  PINK_GERBERA: "INNER_THOUGHTS",
};

const OPTIONAL_LAST_QUESTION: Question = {
  step: 5,
  recipientLine: "에게",
  body: "그동안 못했던 말들을 담아 볼까요?",
  optional: true,
};

export const QUESTIONS_BY_SUBJECT: Record<QuestionSubjectKey, Question[]> = {
  GRATITUDE: [
    { step: 1, recipientLine: "에게", body: "가장 고마웠던 순간은 언제인가요?" },
    { step: 2, recipientLine: " 덕분에", body: "할 수 있게 된 것은 무엇인가요?" },
    {
      step: 3,
      recipientLine: "이",
      body: "티 안 내고 챙겨준다는 걸 느낀 순간이 있나요?",
    },
    {
      step: 4,
      recipientLine: "이",
      body: "해준 말 중 지금도 기억에 남는 한 마디가 있다면요?",
    },
    OPTIONAL_LAST_QUESTION,
  ],
  OUR_MOMENTS: [
    { step: 1, recipientLine: "과", body: "처음 단둘이 있던 때는 언제인가요?" },
    {
      step: 2,
      recipientLine: "과",
      body: "별거 아닌 것 같은데 괜히 즐거웠던 순간은 언제였나요?",
    },
    {
      step: 3,
      recipientLine: "과",
      body: "함께 돌아가고 싶은 순간은 언제인가요?",
    },
    {
      step: 4,
      recipientLine: "과",
      body: "앞으로 같이 하고 싶은 게 있다면 무엇인가요?",
    },
    OPTIONAL_LAST_QUESTION,
  ],
  EMOTIONS: [
    {
      step: 1,
      recipientLine: "이랑",
      body: "있을 때 주로 어떤 얘기를 나누시나요?",
    },
    { step: 2, recipientLine: "과", body: "함께 있으면 어떤 기분이 드나요?" },
    {
      step: 3,
      recipientLine: "에게",
      body: "이해받는다고 느꼈던 순간은 언제인가요?",
    },
    {
      step: 4,
      recipientLine: "에게",
      body: "솔직하게 말 못 했던 감정이 있다면 무엇인가요?",
    },
    OPTIONAL_LAST_QUESTION,
  ],
  INNER_THOUGHTS: [
    {
      step: 1,
      recipientLine: "이",
      body: "잘 모를 것 같은 나만의 습관이나 취향이 있나요?",
    },
    {
      step: 2,
      recipientLine: "에게서",
      body: "발견한 의외의 점이 있나요?",
    },
    {
      step: 3,
      recipientLine: "과",
      body: "있을 때 새롭게 알게 된 나의 모습은?",
    },
    {
      step: 4,
      recipientLine: "과",
      body: "나눠보고싶은 이야기나 주제가 있나요?",
    },
    OPTIONAL_LAST_QUESTION,
  ],
};

export const getQuestions = (bouquetTypeKey: BouquetTypeKey): Question[] =>
  QUESTIONS_BY_SUBJECT[BOUQUET_TO_SUBJECT[bouquetTypeKey]];
