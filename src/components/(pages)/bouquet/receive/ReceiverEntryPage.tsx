"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import chevronLeftIcon from "@/assets/icons/chevron-left-icon.svg";
import { Button } from "@/components/Button";
import Footer from "@/components/Footer";
import { useBouquetByLinkQuery } from "@/features/bouquet";

const DEFAULT_SENDER_NAME = "누군가";

export default function ReceiverEntryPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const token = params.token;
  const { data } = useBouquetByLinkQuery(token);
  const senderName = data?.senderName?.trim() || DEFAULT_SENDER_NAME;
  const canParticipate = Boolean(token) && Boolean(data);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleParticipate = () => {
    if (!token) {
      return;
    }
    router.push(`/bouquet/${token}/nickname`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-white)]">
      <section className="relative h-[910px] w-full max-w-[430px] overflow-hidden bg-white">
        <Image
          src="/images/receiver_bg.png"
          alt=""
          aria-hidden
          priority
          fill
          className="h-[910px] w-full object-cover"
        />

        <div className="relative z-10 h-[44px]" aria-hidden />

        <section className="relative z-10 h-full">
          <div className="absolute left-0 top-[50px] flex w-full flex-col items-center gap-4 px-5 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="typo-title-1 text-[var(--color-red-400)]">{senderName}</span>
                <span className="typo-title-1 text-[var(--color-brown-300)]">님이</span>
              </div>
              <p className="typo-title-1 whitespace-pre-line text-[var(--color-brown-300)]">
                꽃과 마음 문답을{"\n"}보냈어요
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="typo-caption-1 inline-flex h-9 items-center gap-1 rounded-[10px] bg-[rgba(255,255,255,0.85)] px-3 text-[var(--color-gray-300)]"
            >
              마음 문답이란?
              <Image
                src={chevronLeftIcon}
                alt=""
                aria-hidden
                className="h-4 w-4 rotate-180"
              />
            </button>
          </div>

          <div className="absolute left-0 top-[585px] w-full px-[10px] text-center">
            <p className="typo-body-1 whitespace-pre-line text-[var(--color-brown-300)]">
              마음을 담은 질문에 답하고,{"\n"}꽃다발을 완성해볼까요?
            </p>
          </div>

          <div className="absolute left-0 top-[653px] w-full px-5">
            <Button
              className="h-12 w-full"
              onClick={handleParticipate}
              disabled={!canParticipate}
            >
              참여하기
            </Button>
          </div>

          <Footer className="top-[730px] gap-3" />

          {isGuideOpen ? (
            <div className="absolute inset-0 z-30 flex items-start justify-center px-5 pt-[240px]">
              <div className="flex w-[296px] flex-col gap-4 rounded-lg bg-white px-3 py-5">
                <div className="flex flex-col gap-2 text-center">
                  <h2 className="typo-body-2-2 text-[var(--color-red-400)]">
                    마음 문답이란
                  </h2>
                  <p className="typo-caption-1 whitespace-pre-line text-[#393939]">
                    공통 질문에 함께 답하며 미처 몰랐던{"\n"}가족의 마음을
                    들여다보는 마음 꽃집의 활동이에요.{"\n"}
                    <span className="text-[var(--color-green-500)]">
                      상대방을 떠올리며 진심을 담아 답해보세요.
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(false)}
                  className="flex h-[37px] w-full items-center justify-center rounded-[9.25px] bg-[var(--color-green-400)] text-[12.333px] leading-[150%] tracking-[0.07px] text-white"
                >
                  확인
                </button>
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </main>
  );
}
