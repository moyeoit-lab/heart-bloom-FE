import { Suspense } from "react";

import type { Metadata } from "next";

import ReceiverQuestionStepPage from "@/components/(pages)/bouquet/receive/ReceiverQuestionStepPage";

export const metadata: Metadata = {
  title: "꽃 문답 답변 | 마음 꽃집",
  description: "수신자 문답 답변 화면",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReceiverQuestionStepPage />
    </Suspense>
  );
}
