import { Suspense } from "react";

import type { Metadata } from "next";

import QuestionStepPage from "@/components/(pages)/bouquet/create/QuestionStepPage";

export const metadata: Metadata = {
  title: "꽃문답 | 마음 꽃집",
  description: "꽃다발에 담을 마음을 한 문장씩 풀어주세요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <QuestionStepPage />
    </Suspense>
  );
}
