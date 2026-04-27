import { Suspense } from "react";

import type { Metadata } from "next";

import BouquetTypeSelectPage from "@/components/(pages)/bouquet/create/BouquetTypeSelectPage";

export const metadata: Metadata = {
  title: "꽃다발 종류 선택 | 마음 꽃집",
  description: "어떤 꽃다발로 마음을 전달할지 골라보세요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <BouquetTypeSelectPage />
    </Suspense>
  );
}
