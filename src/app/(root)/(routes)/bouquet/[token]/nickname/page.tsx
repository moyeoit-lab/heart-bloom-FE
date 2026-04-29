import { Suspense } from "react";

import type { Metadata } from "next";

import ReceiverNicknamePage from "@/components/(pages)/bouquet/receive/ReceiverNicknamePage";

export const metadata: Metadata = {
  title: "닉네임 설정 | 마음 꽃집",
  description: "수신자 닉네임을 설정해 주세요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReceiverNicknamePage />
    </Suspense>
  );
}
