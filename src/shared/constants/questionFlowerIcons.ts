import type { StaticImageData } from "next/image";

import paperIcon from "@/assets/images/bouquet-done/paper.svg";
import blueQ1 from "@/assets/images/bouquets/blue-flower-question-1.svg";
import blueQ2 from "@/assets/images/bouquets/blue-flower-question-2.svg";
import blueQ3 from "@/assets/images/bouquets/blue-flower-question-3.svg";
import blueQ4 from "@/assets/images/bouquets/blue-flower-question-4.svg";
import pinkQ1 from "@/assets/images/bouquets/pink-flower-question-1.svg";
import pinkQ2 from "@/assets/images/bouquets/pink-flower-question-2.svg";
import pinkQ3 from "@/assets/images/bouquets/pink-flower-question-3.svg";
import pinkQ4 from "@/assets/images/bouquets/pink-flower-question-4.svg";
import redQ1 from "@/assets/images/bouquets/red-flower-question-1.svg";
import redQ2 from "@/assets/images/bouquets/red-flower-question-2.svg";
import redQ3 from "@/assets/images/bouquets/red-flower-question-3.svg";
import redQ4 from "@/assets/images/bouquets/red-flower-question-4.svg";
import yellowQ1 from "@/assets/images/bouquets/yellow-flower-qustion-1.svg";
import yellowQ2 from "@/assets/images/bouquets/yellow-flower-qustion-2.svg";
import yellowQ3 from "@/assets/images/bouquets/yellow-flower-qustion-3.svg";
import yellowQ4 from "@/assets/images/bouquets/yellow-flower-qustion-4.svg";
import type { BouquetTypeKey } from "@/features/bouquet";

const NOTE_STEP = 5;

type FlowerIconStep = 1 | 2 | 3 | 4;
type FlowerIconMap = Record<FlowerIconStep, StaticImageData>;

// Figma 디자인 기준 (꽃다발, step) → 꽃 아이콘 매핑.
// step 순서가 BE 시드의 questionId 순서와 다른 곳이 있어서 (꽃다발마다 swap),
// 발신자/수신자 detail 페이지가 같은 매핑을 공유.
const FLOWER_ICONS_BY_TYPE: Partial<Record<BouquetTypeKey, FlowerIconMap>> = {
  YELLOW_TULIP: {
    1: yellowQ1,
    2: yellowQ2,
    3: yellowQ3,
    4: yellowQ4,
  },
  PINK_GERBERA: {
    1: pinkQ3,
    2: pinkQ4,
    3: pinkQ2,
    4: pinkQ1,
  },
  RED_CARNATION: {
    1: redQ4,
    2: redQ2,
    3: redQ3,
    4: redQ1,
  },
  BLUE_LILY: {
    1: blueQ3,
    2: blueQ4,
    3: blueQ1,
    4: blueQ2,
  },
};

export const pickQuestionFlowerIcon = (
  bouquetTypeKey: BouquetTypeKey,
  step: number,
): StaticImageData => {
  if (step === NOTE_STEP) return paperIcon;
  const map = FLOWER_ICONS_BY_TYPE[bouquetTypeKey];
  if (!map) return paperIcon;
  return map[step as FlowerIconStep] ?? paperIcon;
};
