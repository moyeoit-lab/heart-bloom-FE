import { Suspense } from "react";

import type { Metadata } from "next";

import ReceiverBouquetDonePage from "@/components/(pages)/bouquet/done/ReceiverBouquetDonePage";

const DEFAULT_SENDER_NAME = "누군가";
const DEFAULT_RECEIVER_NAME = "상대방";
const SHARE_DESCRIPTION =
  "드디어 꽃다발이 완성되었어요! 꽃다발 냉장고에서 확인해 보세요.";

type PageProps = {
  searchParams: Promise<{
    senderName?: string | string[];
    receiverName?: string | string[];
  }>;
};

const toSafeName = (
  value: string | string[] | undefined,
  fallback: string,
): string => {
  const text = Array.isArray(value) ? value[0] : value;
  const trimmed = text?.trim();
  if (!trimmed) {
    return fallback;
  }

  return trimmed;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const senderName = toSafeName(params.senderName, DEFAULT_SENDER_NAME);
  const receiverName = toSafeName(params.receiverName, DEFAULT_RECEIVER_NAME);
  const shareTitle = `${senderName}님과 ${receiverName}님의 꽃다발 완성`;

  return {
    title: `${shareTitle} | 마음 꽃집`,
    description: SHARE_DESCRIPTION,
    openGraph: {
      title: shareTitle,
      description: SHARE_DESCRIPTION,
      siteName: "마음 꽃집",
      url: "https://www.heart-blooming.site/bouquet/receive/done",
      images: [
        {
          url: "/images/og-default.png",
          width: 800,
          height: 400,
          alt: shareTitle,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: SHARE_DESCRIPTION,
      images: ["/images/og-default.png"],
    },
  };
}

// TODO(routing): 정식 수신자 흐름 라우트 정해지면 옮길 자리.
export default function Page() {
  return (
    <Suspense fallback={null}>
      <ReceiverBouquetDonePage />
    </Suspense>
  );
}
