"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

// TODO(asset): 수신자 완료 후 로딩 일러스트(피그마 16979:14937 흰 박스 꽃다발) 받으면 교체.
import loadingSvg from "@/assets/images/packing/loading.svg";

const PAGE_WIDTH = 375;
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
      className="mx-auto flex min-h-dvh flex-col items-center bg-gradient-to-t from-[#fed8e1] to-[#f9f7de]"
      style={{ width: PAGE_WIDTH }}
    >
      <div className="flex flex-col items-center gap-4 px-5 pt-[148px]">
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

      <Image
        src={loadingSvg}
        alt=""
        aria-hidden
        priority
        className="mt-auto block h-auto w-full"
      />
    </main>
  );
}
