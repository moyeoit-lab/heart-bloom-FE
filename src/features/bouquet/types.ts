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
