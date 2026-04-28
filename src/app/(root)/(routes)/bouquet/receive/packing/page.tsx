import { Suspense } from "react";

import type { Metadata } from "next";

import ReceiverPackingPage from "@/components/(pages)/bouquet/receive/ReceiverPackingPage";

export const metadata: Metadata = {
  title: "꽃다발 포장중 | 마음 꽃집",
  description: "수신자 답변 완료 후 포장 로딩 화면",
};

// TODO(routing): 정식 수신자 흐름(/bouquets/links/{token}/...)으로 옮길 자리.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReceiverPackingPage />
    </Suspense>
  );
}
