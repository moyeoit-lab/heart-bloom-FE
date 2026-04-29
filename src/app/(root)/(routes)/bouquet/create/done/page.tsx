import { Suspense } from "react";

import type { Metadata } from "next";

import PackingDonePage from "@/components/(pages)/bouquet/create/PackingDonePage";

export const metadata: Metadata = {
  title: "꽃다발 준비 완료 | 마음 꽃집",
  description: "1차 포장 완료. 상대방에게 링크를 공유해 보세요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PackingDonePage />
    </Suspense>
  );
}
