import { Suspense } from "react";

import type { Metadata } from "next";

import CreateBouquetPage from "@/components/(pages)/bouquet/create/CreateBouquetPage";

export const metadata: Metadata = {
  title: "닉네임 설정 | 마음 꽃집",
  description: "꽃다발을 보낼 때 사용할 이름을 설정해 주세요.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <CreateBouquetPage />
    </Suspense>
  );
}
