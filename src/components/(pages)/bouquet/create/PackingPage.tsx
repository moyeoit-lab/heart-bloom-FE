"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const PAGE_WIDTH = 375;
const TRANSITION_DELAY_MS = 1500;

// TODO: 디자이너로부터 모션 자산(Lottie 또는 SVG/PNG composite) 도착하면 본 페이지 일러스트 + 모션 복원.
//   현재는 디자이너 자산 대기 상태라 자동으로 /done 으로 이동시킴.
export default function PackingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const timer = setTimeout(() => {
      router.replace(`/bouquet/create/done${query ? `?${query}` : ""}`);
    }, TRANSITION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

  return (
    <main
      className="mx-auto flex min-h-dvh flex-col items-center justify-center bg-gradient-to-t from-[#fed8e1] to-[#f9f7de]"
      style={{ width: PAGE_WIDTH }}
    >
      <p className="typo-body-1 text-[var(--color-brown-300)]">
        꽃을 고르는 중..
      </p>
    </main>
  );
}
