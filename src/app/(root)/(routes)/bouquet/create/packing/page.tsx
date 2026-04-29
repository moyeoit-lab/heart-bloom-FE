import { Suspense } from "react";

import type { Metadata } from "next";

import PackingPage from "@/components/(pages)/bouquet/create/PackingPage";

export const metadata: Metadata = {
  title: "포장중 | 마음 꽃집",
  description: "꽃다발을 정성껏 포장하고 있어요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PackingPage />
    </Suspense>
  );
}
