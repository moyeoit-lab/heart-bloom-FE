import { Suspense } from "react";

import type { Metadata } from "next";

import RecipientSelectPage from "@/components/(pages)/bouquet/create/RecipientSelectPage";

export const metadata: Metadata = {
  title: "상대방 선택 | 마음 꽃집",
  description: "꽃다발을 받을 상대방을 선택해 주세요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RecipientSelectPage />
    </Suspense>
  );
}
