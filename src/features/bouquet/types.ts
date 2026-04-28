export type BouquetCountResponse = {
  success?: boolean;
  data?: {
    count?: number;
  };
};

export type BouquetTypeKey =
  | "YELLOW_TULIP"
  | "RED_CARNATION"
  | "BLUE_LILY"
  | "PINK_GERBERA";

export type BouquetType = {
  id: BouquetTypeKey | string;
  name: string;
  description: string;
};

export type BouquetTypeListResponse = {
  success?: boolean;
  data?: {
    types?: BouquetType[];
  };
};

export type BouquetRole = "SENDER" | "RECEIVER";

export type BouquetStatus = "IN_PROGRESS" | "COMPLETED";

export type BouquetAnswerEntry = {
  questionId: number;
  content: string;
};

export type CreateSenderBouquetRequest = {
  role: "SENDER";
  partnerId: number;
  bouquetType: string;
  requiredQuestionIds: number[];
  optionalQuestionId?: number;
  answers: BouquetAnswerEntry[];
};

export type CreateSenderBouquetResponse = {
  success?: boolean;
  data?: {
    bouquetId: number;
    role: BouquetRole;
    bouquetType: string;
    status: BouquetStatus;
  };
  message?: string;
};

export type BouquetShelfItem = {
  bouquetId: number;
  senderId: number;
  senderType: "USER" | string;
  receiverId: number | null;
  receiverType: "USER" | string;
  bouquetTypeId: number;
  bouquetName: string;
  bouquetDescription: string;
  bouquetImageUrl?: string | null;
};

export type BouquetShelfResponse = {
  success?: boolean;
  message?: string;
  data?: {
    senderName?: string;
    sentBouquets?: BouquetShelfItem[];
    receivedBouquets?: BouquetShelfItem[];
  };
};
