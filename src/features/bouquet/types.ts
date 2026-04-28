// 클라 내부 식별자. BE 응답의 정수 id와는 별개로 UI 비주얼/매핑용.
export type BouquetTypeKey =
  | "YELLOW_TULIP"
  | "RED_CARNATION"
  | "BLUE_LILY"
  | "PINK_GERBERA";

// 답변 입력 방식 (꽃다발 답변 페이로드의 answerType).
export type AnswerType = "SUBJECTIVE" | "MULTIPLE_CHOICE";

// 랜딩 질문의 필수/선택 구분 (QuestionSummary.answerType).
export type LandingAnswerType = "REQUIRED" | "OPTIONAL";

// 답변자 역할.
export type RespondentType = "SENDER" | "RECEIVER";

// 소셜 로그인 제공자.
export type AuthProviderType = "kakao";

// 꽃다발 인스턴스 상태.
export type BouquetStatus = "ACTIVE" | "EXPIRED";

// 꽃다발 공유 링크 상태.
export type BouquetLinkStatus = "ACTIVE" | "EXPIRED";

export type BouquetSenderType = "USER" | "GUEST";

export type BouquetReceiverType = "USER" | "GUEST" | "EVERYONE";

// ── GET /api/v1/bouquet/count
export type BouquetCountResponse = {
  success?: boolean;
  data?: { count?: number };
  message?: string;
};

// ── GET /api/v1/bouquet/type
export type BouquetType = {
  id: number;
  bouquetName: string;
  bouquetDescription: string;
  bouquetImageUrl: string;
  active: boolean;
  createdAt: string;
};

export type BouquetTypeListResponse = {
  success?: boolean;
  data?: BouquetType[];
  message?: string;
};

// ── GET /api/v1/questions/landing
export type LandingQuestion = {
  questionId: number;
  title: string;
  answerType: LandingAnswerType;
};

export type LandingQuestionsResponse = {
  success?: boolean;
  data?: { questions?: LandingQuestion[] };
  message?: string;
};

// ── POST /api/v1/bouquet
export type CreateBouquetAnswer = {
  questionId: number;
  answerType: AnswerType;
  answer: string;
  sortOrder: number;
};

export type CreateBouquetRequest = {
  displayName: string;
  relationName: string;
  bouquetTypeId: number;
  answers: CreateBouquetAnswer[];
};

export type CreateBouquetResponse = {
  success?: boolean;
  data?: {
    bouquetId: number;
    linkToken: string;
  };
  message?: string;
};

// ── GET /api/v1/bouquet/link/{bouquetId}/url
export type BouquetLinkUrlResponse = {
  success?: boolean;
  data?: { url?: string };
  message?: string;
};

// ── GET /api/v1/bouquets/links/{token}
export type BouquetForReceiver = {
  senderName: string;
  bouquetName: string;
  bouquetImageUrl: string;
};

export type BouquetForReceiverResponse = {
  success?: boolean;
  data?: BouquetForReceiver;
  message?: string;
};

// ── GET /api/v1/bouquets/links/{token}/questions/{questionId}/answers
export type BouquetAnswerEntry = {
  answerId?: number;
  subjectiveContent?: string;
  selectedOptionId?: number;
  sortOrder?: number;
};

export type BouquetQuestionAnswers = {
  questionId: number;
  senderAnswer?: BouquetAnswerEntry;
  receiverAnswer?: BouquetAnswerEntry;
};

export type BouquetQuestionAnswersResponse = {
  success?: boolean;
  data?: BouquetQuestionAnswers;
  message?: string;
};

// ── POST /api/v1/bouquets/links/{token}/answers
export type CompleteBouquetRequest = {
  receiverName: string;
  answers: CreateBouquetAnswer[];
};

// ── POST /api/v1/bouquets/links/{token}/claim
// ── POST /api/v1/bouquets/links/{token}/answers
export type ApiVoidResponse = {
  success?: boolean;
  data?: unknown;
  message?: string;
};
