import { Suspense } from "react";

import type { Metadata } from "next";

import ReceiverEntryPage from "@/components/(pages)/bouquet/receive/ReceiverEntryPage";

export const metadata: Metadata = {
  title: "꽃다발 초대장 | 마음 꽃집",
  description: "수신자 꽃다발 참여 진입 화면",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReceiverEntryPage />
    </Suspense>
  );
}
