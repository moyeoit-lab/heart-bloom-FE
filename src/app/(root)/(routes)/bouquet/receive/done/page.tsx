import { Suspense } from "react";

import type { Metadata } from "next";

import ReceiverBouquetDonePage from "@/components/(pages)/bouquet/done/ReceiverBouquetDonePage";

export const metadata: Metadata = {
  title: "우리만의 꽃다발 | 마음 꽃집",
  description: "수신자 답변까지 완료된 최종 꽃다발 화면",
};

// TODO(routing): 정식 수신자 흐름 라우트 정해지면 옮길 자리.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReceiverBouquetDonePage />
    </Suspense>
  );
}
