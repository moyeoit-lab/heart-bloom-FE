import type { BouquetTypeKey } from "@/features/bouquet/types";

/**
 * 클라 BouquetTypeKey → BE bouquetType 문자열 매핑.
 * TODO(BE): GET /api/v1/bouquet/type 응답에 BE 식별자가 어떤 값으로 내려오는지 확인 후 교체.
 */
export const CLIENT_TO_BE_BOUQUET_TYPE: Record<BouquetTypeKey, string> = {
  YELLOW_TULIP: "TULIP",
  RED_CARNATION: "CARNATION",
  BLUE_LILY: "LILY",
  PINK_GERBERA: "GERBERA",
};

/**
 * 꽃다발별 질문 ID 묶음 (BE의 questionId 정수와 매칭).
 * TODO(BE): 실제 questionId는 BE에서 받아야 함. 현재는 TULIP 예시(1-4 + 9)에 맞춘 placeholder.
 *           질문 조회 endpoint가 추가되면 거기서 받아오도록 교체.
 */
export type QuestionIdSet = {
  required: [number, number, number, number];
  optional: number;
};

export const BE_QUESTION_IDS_BY_TYPE: Record<BouquetTypeKey, QuestionIdSet> = {
  YELLOW_TULIP: { required: [1, 2, 3, 4], optional: 9 },
  RED_CARNATION: { required: [5, 6, 7, 8], optional: 10 },
  BLUE_LILY: { required: [11, 12, 13, 14], optional: 15 },
  PINK_GERBERA: { required: [16, 17, 18, 19], optional: 20 },
};
