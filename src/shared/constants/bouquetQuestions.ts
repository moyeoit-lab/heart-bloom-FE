import type { BouquetTypeKey } from "@/features/bouquet/types";

export type QuestionSubjectKey =
  | "GRATITUDE"
  | "OUR_MOMENTS"
  | "EMOTIONS"
  | "INNER_THOUGHTS";

export type Question = {
  step: number;
  /** 질문 화면(q1-q5) — "상대방" 뒤 josa(또는 josa+첫줄 일부) */
  recipientLine: string;
  /** 질문 화면 본문(두 번째 줄). Figma 기준 줄바꿈은 \n으로 표기. */
  body: string;
  /** 꽃 detail 페이지 짧은 주제 */
  subjectTitle: string;
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
  subjectTitle: "못 했던 말",
  optional: true,
};

export const QUESTIONS_BY_SUBJECT: Record<QuestionSubjectKey, Question[]> = {
  GRATITUDE: [
    {
      step: 1,
      recipientLine: "에게",
      body: "가장 고마웠던 순간은 언제인가요?",
      subjectTitle: "고마웠던 순간",
    },
    {
      step: 2,
      recipientLine: " 덕분에",
      body: "할 수 있게 된 것은 무엇인가요?",
      subjectTitle: "할 수 있게 된 것",
    },
    {
      step: 3,
      recipientLine: "이",
      body: "티 내지 않고 챙겨 준다는 걸\n느낀 순간이 있나요?",
      subjectTitle: "챙겨주는 느낌",
    },
    {
      step: 4,
      recipientLine: "이 해준 말 중",
      body: "지금도 기억에 남는 한마디가\n있다면 무엇인가요?",
      subjectTitle: "기억에 남는 한 마디",
    },
    OPTIONAL_LAST_QUESTION,
  ],
  OUR_MOMENTS: [
    {
      step: 1,
      recipientLine: "과",
      body: "처음 단둘이 있던 때는 언제인가요?",
      subjectTitle: "단둘이 있던 시간",
    },
    {
      step: 2,
      recipientLine: "과",
      body: "별거 아닌 것 같은데 괜히\n즐거웠던 순간은 언제였나요?",
      subjectTitle: "즐거웠던 때",
    },
    {
      step: 3,
      recipientLine: "과",
      body: "함께 돌아가고 싶은\n순간은 언제인가요?",
      subjectTitle: "돌아가고싶은 순간",
    },
    {
      step: 4,
      recipientLine: "과",
      body: "앞으로 같이 하고 싶은게\n있다면 무엇인가요?",
      subjectTitle: "같이 하고싶은 것",
    },
    OPTIONAL_LAST_QUESTION,
  ],
  EMOTIONS: [
    {
      step: 1,
      recipientLine: "과 있을 때",
      body: "주로 어떤 이야기를 나누나요?",
      subjectTitle: "주로 나누는 이야기",
    },
    {
      step: 2,
      recipientLine: "과",
      body: "함께 있으면 어떤 기분이 드나요?",
      subjectTitle: "함께한 기분",
    },
    {
      step: 3,
      recipientLine: "에게",
      body: "이해 받는다고 느꼈던 순간은\n언제인가요?",
      subjectTitle: "이해받았던 순간",
    },
    {
      step: 4,
      recipientLine: "에게",
      body: "솔직하게 말 못 했던게 있다면\n무엇인가요?",
      subjectTitle: "솔직한 마음",
    },
    OPTIONAL_LAST_QUESTION,
  ],
  INNER_THOUGHTS: [
    {
      step: 1,
      recipientLine: "이 모를 것 같은",
      body: "나만의 습관이나 취향이\n있다면 무엇인가요?",
      subjectTitle: "습관과 취향",
    },
    {
      step: 2,
      recipientLine: "에게서",
      body: "발견한 의외의 점이 있나요?",
      subjectTitle: "의외의 점",
    },
    {
      step: 3,
      recipientLine: "과 있을때",
      body: "새롭게 알게 된 나의 모습은?",
      subjectTitle: "새로 발견한 나",
    },
    {
      step: 4,
      recipientLine: "과 새롭게",
      body: "대화 해보고 싶은 주제는\n무엇 인가요?",
      subjectTitle: "우리의 새 대화 주제",
    },
    OPTIONAL_LAST_QUESTION,
  ],
};

export const getQuestions = (bouquetTypeKey: BouquetTypeKey): Question[] =>
  QUESTIONS_BY_SUBJECT[BOUQUET_TO_SUBJECT[bouquetTypeKey]];

export const getQuestionByStep = (
  bouquetTypeKey: BouquetTypeKey,
  step: number,
): Question | undefined => getQuestions(bouquetTypeKey)[step - 1];
