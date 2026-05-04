"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import loadingSvg from "@/assets/images/packing/loading-sender.svg";
import { useBodyBackground } from "@/shared/hooks/useBodyBackground";

const PAGE_WIDTH = 390;
const PAGE_HEIGHT = 739;
const PAGE_MAX_HEIGHT = 1023;
const PAGE_BG_CLASS = "bg-gradient-to-t from-[#fed8e1] to-[#f9f7de]";
const TRANSITION_DELAY_MS = 1500;
const DOT_CYCLE_MS = 450;
const DOT_COUNT = 3;
const DEFAULT_NICKNAME = "이름";

export default function ReceiverPackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const senderName = searchParams.get("senderName")?.trim() || DEFAULT_NICKNAME;
  const receiverName =
    searchParams.get("receiverName")?.trim() || DEFAULT_NICKNAME;
  useBodyBackground(PAGE_BG_CLASS);
  const [dotStep, setDotStep] = useState(0);

  useEffect(() => {
    const query = searchParams.toString();
    const timer = setTimeout(() => {
      // TODO(routing): 수신자 흐름 정식 라우트 정해지면 push 경로 교체.
      router.replace(`/bouquet/receive/done${query ? `?${query}` : ""}`);
    }, TRANSITION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotStep((prev) => (prev + 1) % DOT_COUNT);
    }, DOT_CYCLE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className="relative mx-auto overflow-hidden bg-gradient-to-t from-[#fed8e1] to-[#f9f7de]"
      style={{
        width: PAGE_WIDTH,
        minHeight: PAGE_HEIGHT,
        maxHeight: PAGE_MAX_HEIGHT,
      }}
    >
      <Image
        src={loadingSvg}
        alt=""
        aria-hidden
        priority
        fill
        sizes={`${PAGE_WIDTH}px`}
        className="absolute inset-0 z-0 object-contain object-bottom"
      />

      <div className="relative z-10 flex flex-col items-center gap-4 px-5 pt-[148px]">
        <h1 className="typo-title-1 text-center font-kimm tracking-[-2.257px]">
          <span className="text-[var(--color-red-300)]">{senderName}</span>
          <span className="text-[var(--color-brown-300)]">,</span>
          <span className="text-[var(--color-red-300)]">{receiverName}</span>
          <span className="text-[var(--color-brown-300)]">님의</span>
          <span className="block text-[var(--color-brown-300)]">꽃다발을</span>
          <span className="block text-[var(--color-brown-300)]">
            예쁘게 포장중
            <span aria-hidden className="inline-block">
              {Array.from({ length: DOT_COUNT }, (_, index) => (
                <span
                  key={index}
                  className={index <= dotStep ? "opacity-100" : "opacity-0"}
                >
                  .
                </span>
              ))}
            </span>
          </span>
        </h1>
        <p className="typo-body-1 whitespace-nowrap text-[var(--color-brown-300)]">
          마음을 담아 정성껏 만들고 있어요
        </p>
      </div>
    </main>
  );
}
