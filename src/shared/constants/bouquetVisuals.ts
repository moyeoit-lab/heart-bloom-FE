import type { StaticImageData } from "next/image";

import blueFlower from "@/assets/images/bouquets/blue-flower.svg";
import blueLilyThumb from "@/assets/images/bouquets/blue-lily-thumb.svg";
import pinkFlower from "@/assets/images/bouquets/pink-flower.svg";
import pinkGerberaThumb from "@/assets/images/bouquets/pink-gerbera-thumb.svg";
import redCarnationThumb from "@/assets/images/bouquets/red-carnation-thumb.svg";
import redFlower from "@/assets/images/bouquets/red-flower.svg";
import yellowFlower from "@/assets/images/bouquets/yellow-flower.svg";
import yellowTulipThumb from "@/assets/images/bouquets/yellow-tulip-thumb-flower.svg";

import type { BouquetTypeKey } from "@/features/bouquet/types";

export type BouquetVisual = {
  /** BE bouquet_type_id (시드 기준 1..4). 매핑이 바뀌면 BE 응답으로 보정. */
  beId: number;
  key: BouquetTypeKey;
  fallbackName: string;
  fallbackDescription: string;
  thumbnail: StaticImageData;
  hero: StaticImageData | null;
  /** 꽃다발 종류 선택 화면 hero 영역에서 표시되는 꽃 크기. Figma 17378:3801 그룹 기준. */
  heroWidth: number;
  heroHeight: number;
  bgColor: string;
  accentColor: string;
};

export const BOUQUET_VISUALS: BouquetVisual[] = [
  {
    beId: 1,
    key: "YELLOW_TULIP",
    fallbackName: "기억의 노란 튤립",
    fallbackDescription: "둘만 아는 소중한 순간의 질문이 나타나요",
    thumbnail: yellowTulipThumb,
    hero: yellowFlower,
    heroWidth: 147.36,
    heroHeight: 235.87,
    bgColor: "#FFFBDC",
    accentColor: "var(--color-point-yellow)",
  },
  {
    beId: 2,
    key: "RED_CARNATION",
    fallbackName: "감사의 붉은 카네이션",
    fallbackDescription: "고마움과 따뜻한 마음의 질문이 나타나요",
    thumbnail: redCarnationThumb,
    hero: redFlower,
    heroWidth: 182.26,
    heroHeight: 257.15,
    bgColor: "#FCE5E5",
    accentColor: "var(--color-point-red)",
  },
  {
    beId: 3,
    key: "BLUE_LILY",
    fallbackName: "이해의 푸른 백합",
    fallbackDescription: "미처 나누지 못했던 마음의 질문이 나타나요",
    thumbnail: blueLilyThumb,
    hero: blueFlower,
    heroWidth: 176.92,
    heroHeight: 258.01,
    bgColor: "#DDEFFE",
    accentColor: "var(--color-point-blue)",
  },
  {
    beId: 4,
    key: "PINK_GERBERA",
    fallbackName: "속 마음의 분홍 거베라",
    fallbackDescription: "몰랐던 서로의 마음의 질문이 나타나요",
    thumbnail: pinkGerberaThumb,
    hero: pinkFlower,
    heroWidth: 175.58,
    heroHeight: 251.62,
    bgColor: "#FCE5EE",
    accentColor: "var(--color-point-pink)",
  },
];

export const getBouquetVisualByKey = (key: BouquetTypeKey) =>
  BOUQUET_VISUALS.find((visual) => visual.key === key);

export const getBouquetVisualById = (id: number) =>
  BOUQUET_VISUALS.find((visual) => visual.beId === id);

export const getBouquetVisualByName = (name: string | undefined) => {
  if (!name) return undefined;
  const trimmed = name.trim();
  return BOUQUET_VISUALS.find((visual) => visual.fallbackName === trimmed);
};
