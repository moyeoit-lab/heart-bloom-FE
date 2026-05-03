import { Suspense } from "react";

import type { Metadata } from "next";

import ReceiverEntryPage from "@/components/(pages)/bouquet/receive/ReceiverEntryPage";

const SHARE_TITLE = "마음 꽃집에서 꽃다발이 도착했어요";
const SHARE_DESCRIPTION =
  "마음을 담은 질문에 답하고, 우리만의 꽃다발을 완성해볼까요?";

export const metadata: Metadata = {
  title: `${SHARE_TITLE} | 마음 꽃집`,
  description: SHARE_DESCRIPTION,
  openGraph: {
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    siteName: "마음 꽃집",
    images: [
      {
        url: "/images/og-bouquet-share.png",
        width: 1200,
        height: 630,
        alt: SHARE_TITLE,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SHARE_TITLE,
    description: SHARE_DESCRIPTION,
    images: ["/images/og-bouquet-share.png"],
  },
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReceiverEntryPage />
    </Suspense>
  );
}
