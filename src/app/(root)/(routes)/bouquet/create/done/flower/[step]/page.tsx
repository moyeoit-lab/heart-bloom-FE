import { Suspense } from "react";

import type { Metadata } from "next";

import FlowerDetailPage from "@/components/(pages)/bouquet/create/FlowerDetailPage";

export const metadata: Metadata = {
  title: "꽃 자세히 보기 | 마음 꽃집",
  description: "꽃다발 속 한 송이 꽃에 담긴 답변을 자세히 확인해 보세요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <FlowerDetailPage />
    </Suspense>
  );
}
