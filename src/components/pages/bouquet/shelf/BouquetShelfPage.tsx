"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import heartBloomIcon from "@/assets/icons/heart-bloom-text.svg";
import emptyBouquetImage from "@/assets/images/bouquets/empty-shelf.svg";
import blueBouquetImage from "@/assets/images/bouquets/blue-shelf.svg";
import pinkBouquetImage from "@/assets/images/bouquets/pink-shelf.svg";
import redBouquetImage from "@/assets/images/bouquets/red-shelf.svg";
import yellowBouquetImage from "@/assets/images/bouquets/yellow-shelf.svg";
import { Button } from "@/components/Button";
import { useBouquetShelfQuery } from "@/features/bouquet/queries";
import type { BouquetShelfItem } from "@/features/bouquet/types";
import { getBouquetVisualById } from "@/shared/constants/bouquetVisuals";
import { useBodyBackground } from "@/shared/hooks/useBodyBackground";

type BouquetCard = {
  id: string;
  bouquetType: "red" | "pink" | "yellow" | "blue" | "empty";
  item?: BouquetShelfItem;
};

type BouquetType = BouquetCard["bouquetType"];

const BOUQUET_IMAGE_BY_TYPE = {
  red: redBouquetImage,
  pink: pinkBouquetImage,
  yellow: yellowBouquetImage,
  blue: blueBouquetImage,
  empty: emptyBouquetImage,
} as const;

const MAX_BOUQUET_COUNT = 6;

const getBouquetTypeFromId = (bouquetTypeId: number): BouquetType => {
  switch (bouquetTypeId) {
    case 1:
      return "yellow";
    case 2:
      return "red";
    case 3:
      return "blue";
    case 4:
      return "pink";
    default:
      return "empty";
  }
};

const buildDisplayCards = (
  prefix: string,
  bouquets: BouquetShelfItem[],
): BouquetCard[] => {
  const displayCount = Math.max(MAX_BOUQUET_COUNT, bouquets.length);

  return Array.from({ length: displayCount }, (_, index) => ({
    id: `${prefix}-${index + 1}`,
    bouquetType: bouquets[index]
      ? getBouquetTypeFromId(bouquets[index].bouquetTypeId)
      : "empty",
    item: bouquets[index],
  }));
};

const getTokenFromItem = (item: BouquetShelfItem) =>
  item.linkToken?.trim() || item.token?.trim();

const isWaitingAnswer = (item: BouquetShelfItem) =>
  item.answerStatus === "WAITING_FOR_MY_ANSWER" ||
  item.answerStatus === "WAITING_FOR_COUNTERPART_ANSWER" ||
  item.answerStatus === "NOT_ANSWERED";

const buildDonePageQuery = (
  item: BouquetShelfItem,
  options: {
    senderName: string;
    receiverName: string;
    token?: string;
    bouquetId?: number;
  },
) => {
  const query = new URLSearchParams({
    senderName: options.senderName,
    receiverName: options.receiverName,
  });
  const bouquetType = getBouquetVisualById(item.bouquetTypeId)?.key;
  if (bouquetType) {
    query.set("bouquetType", bouquetType);
  }
  if (options.token) {
    query.set("token", options.token);
  }
  if (options.bouquetId) {
    query.set("bouquetId", String(options.bouquetId));
  }
  return `/bouquet/receive/done?${query.toString()}`;
};

export default function BouquetShelfPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  useBodyBackground("bg-[#fafafa]");
  const { data: bouquetShelfData } = useBouquetShelfQuery();
  const nickname = bouquetShelfData?.senderName?.trim() || "";
  const sentBouquets = bouquetShelfData?.sentBouquets ?? [];
  const receivedBouquets = bouquetShelfData?.receivedBouquets ?? [];

  const cards = useMemo(() => {
    if (activeTab === "sent") {
      return buildDisplayCards("sent", sentBouquets);
    }
    return buildDisplayCards("received", receivedBouquets);
  }, [activeTab, sentBouquets, receivedBouquets]);

  const handleCardClick = (item: BouquetShelfItem | undefined) => {
    if (!item?.bouquetId) {
      return;
    }

    const token = getTokenFromItem(item);
    const displayName = item.displayName?.trim() || "";
    const receiverName = item.receiverName?.trim() || "";
    const answerStatus = item.answerStatus;

    if (activeTab === "sent") {
      if (answerStatus === "WAITING_FOR_COUNTERPART_ANSWER") {
        const displayName = item.displayName?.trim() || nickname || "보낸 사람";
        const receiverName = item.receiverName?.trim() || "상대방";
        const query = new URLSearchParams({
          displayName,
          receiverName,
          // 기존 create 플로우와의 하위 호환을 위해 유지.
          nickname: displayName,
          recipient: receiverName,
        });
        const bouquetType = getBouquetVisualById(item.bouquetTypeId)?.key;
        if (bouquetType) {
          query.set("bouquetType", bouquetType);
        }
        query.set("bouquetId", String(item.bouquetId));
        router.push(`/bouquet/create/done?${query.toString()}`);
        return;
      }

      if (answerStatus === "COMPLETED") {
        router.push(
          buildDonePageQuery(item, {
            senderName: displayName || nickname || "보낸 사람",
            receiverName: receiverName || displayName || "받는 사람",
            token,
            bouquetId: item.bouquetId,
          }),
        );
      }
      return;
    }

    if (answerStatus === "WAITING_FOR_MY_ANSWER" && token) {
      router.push(`/bouquet/${token}`);
      return;
    }

    if (answerStatus === "COMPLETED") {
      router.push(
        buildDonePageQuery(item, {
          senderName: displayName || "보낸 사람",
          receiverName: receiverName || nickname || "받는 사람",
          token,
          bouquetId: item.bouquetId,
        }),
      );
    }
  };

  return (
    <main className="mx-auto flex min-h-dvh min-w-[375px] w-full max-w-[430px] flex-col bg-[#fafafa]">
      <header className="flex items-center justify-between p-4">
        <Link
          href="/"
          aria-label="이전으로 돌아가기"
          className="flex h-6 w-6 items-center justify-center text-[var(--color-black)]"
        >
          <Image src={chevronLeftIcon} alt="" aria-hidden />
        </Link>

        <div className="flex gap-2 px-4 py-2">
          <div className="flex items-end pb-1 gap-1" aria-hidden>
            <span className="h-2 w-2 rounded-full bg-[var(--color-red-400)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-green-400)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--color-point-yellow)]" />
          </div>
          <div className="flex items-center gap-1 rounded-xs bg-[var(--color-brown-400)] px-4 py-2">
            <Image src={heartBloomIcon} alt="마음 꽃집" aria-hidden />
          </div>
        </div>
      </header>

      <section className="flex flex-1 flex-col px-5 pb-5">
        <div className="flex flex-col gap-2 pb-4 pt-3">
          <div className="typo-title-2 flex flex-wrap items-end">
            <span className="text-[var(--color-green-500)]">{nickname}</span>
            <span className="text-[var(--color-brown-300)]">
              님의 꽃다발 진열대
            </span>
          </div>
          <p className="typo-body-2 text-[var(--color-brown-200)]">
            그동안 만들고 받았던 꽃다발을 확인할 수 있어요.
          </p>
        </div>

        <div className="rounded-[10px] border border-[var(--color-gray-100)] bg-[var(--color-gray-050)] p-0.5">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab("sent")}
              className={`typo-body-3 flex h-9 flex-1 items-center justify-center rounded-lg ${
                activeTab === "sent"
                  ? "bg-[var(--color-white)] text-[var(--color-brown-600)] shadow-[0_0_4px_rgba(0,0,0,0.12)]"
                  : "text-[var(--color-gray-300)]"
              }`}
            >
              만든 꽃다발
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("received")}
              className={`typo-body-3 flex h-9 flex-1 items-center justify-center rounded-lg ${
                activeTab === "received"
                  ? "bg-[var(--color-white)] text-[var(--color-brown-600)] shadow-[0_0_4px_rgba(0,0,0,0.12)]"
                  : "text-[var(--color-gray-300)]"
              }`}
            >
              받은 꽃다발
            </button>
          </div>
        </div>

        <div className="mt-4 grid flex-1 auto-rows-[193px] grid-cols-2 gap-4 overflow-y-auto pb-28">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCardClick(card.item)}
              aria-label={
                card.item
                  ? `${card.item.bouquetName} 보기`
                  : "비어 있는 꽃다발 칸"
              }
              className="relative flex h-[193px] items-center justify-center overflow-hidden"
              disabled={!card.item}
            >
              {card.item && isWaitingAnswer(card.item) ? (
                <span className="typo-caption-2 absolute left-[18px] top-3 z-10 rounded-[4px] border border-[var(--color-gray-100)] bg-[var(--color-white)] px-[10px] py-[3px] text-[var(--color-brown-300)] opacity-70 shadow-[0_0_12px_0_rgba(69,48,48,0.12)]">
                  답변 대기중
                </span>
              ) : null}
              <Image
                src={BOUQUET_IMAGE_BY_TYPE[card.bouquetType]}
                alt=""
                aria-hidden
                className="h-[193px] w-[160px]"
              />
            </button>
          ))}
        </div>
      </section>

      <div className="pointer-events-none fixed bottom-0 left-1/2 z-10 w-full max-w-[430px] -translate-x-1/2 bg-gradient-to-b from-transparent to-white px-5 pb-safe-bottom pt-5">
        <Button
          variant="solid"
          className="pointer-events-auto h-12 w-full"
          onClick={() => router.push("/bouquet/create")}
        >
          새 꽃다발 만들기
        </Button>
      </div>
    </main>
  );
}
