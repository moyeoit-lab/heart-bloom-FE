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
  key: BouquetTypeKey;
  fallbackName: string;
  fallbackDescription: string;
  thumbnail: StaticImageData;
  hero: StaticImageData | null;
  bgColor: string;
  accentColor: string;
};

export const BOUQUET_VISUALS: BouquetVisual[] = [
  {
    key: "YELLOW_TULIP",
    fallbackName: "기억의 노란 튤립",
    fallbackDescription: "둘만 아는 소중한 순간의 질문이 나타나요",
    thumbnail: yellowTulipThumb,
    hero: yellowFlower,
    bgColor: "#FFFBDC",
    accentColor: "var(--color-point-yellow)",
  },
  {
    key: "RED_CARNATION",
    fallbackName: "감사의 붉은 카네이션",
    fallbackDescription: "고마움과 따뜻한 마음의 질문이 나타나요",
    thumbnail: redCarnationThumb,
    hero: redFlower,
    bgColor: "#FCE5E5",
    accentColor: "var(--color-point-red)",
  },
  {
    key: "BLUE_LILY",
    fallbackName: "이해의 푸른 백합",
    fallbackDescription: "미처 나누지 못했던 마음의 질문이 나타나요",
    thumbnail: blueLilyThumb,
    hero: blueFlower,
    bgColor: "#DDEFFE",
    accentColor: "var(--color-point-blue)",
  },
  {
    key: "PINK_GERBERA",
    fallbackName: "속 마음의 분홍 거베라",
    fallbackDescription: "몰랐던 서로의 마음의 질문이 나타나요",
    thumbnail: pinkGerberaThumb,
    hero: pinkFlower,
    bgColor: "#FCE5EE",
    accentColor: "var(--color-point-pink)",
  },
];
