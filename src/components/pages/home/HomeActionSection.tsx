"use client";

import { useSyncExternalStore } from "react";
import OauthButton from "@/components/pages/home/OauthButton";
import { useBouquetCountQuery } from "@/features/bouquet/queries";

type HomeActionSectionProps = {
  onBouquetShelfClick?: () => void;
  onCreateBouquetClick?: () => void;
};

export default function HomeActionSection({
  onBouquetShelfClick,
  onCreateBouquetClick,
}: HomeActionSectionProps) {
  const { data: bouquetCount } = useBouquetCountQuery();
  const isLoggedIn = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => {};
      }

      window.addEventListener("storage", onStoreChange);
      return () => window.removeEventListener("storage", onStoreChange);
    },
    () => {
      if (typeof window === "undefined") {
        return null;
      }

      return Boolean(localStorage.getItem("accessToken"));
    },
    () => null,
  );

  const formattedBouquetCount = bouquetCount?.toLocaleString("ko-KR") ?? "0";

  const handleCreateBouquetClick = () => {
    if (onCreateBouquetClick) {
      onCreateBouquetClick();
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = "/bouquet/create";
    }
  };

  const handleBouquetShelfClick = () => {
    if (onBouquetShelfClick) {
      onBouquetShelfClick();
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = "/bouquet";
    }
  };

  return (
    <div className="absolute left-0 top-[687px] flex w-full flex-col gap-2 px-5 pb-5">
      <p className="flex justify-center gap-[2px] text-center">
        <span className="typo-body-2-1 text-[var(--color-brown-200)]">
          지금까지
        </span>
        <span className="typo-body-2-2 text-[var(--color-red-400)]">
          {formattedBouquetCount}명
        </span>
        <span className="typo-body-2-1 text-[var(--color-brown-200)]">
          의 꽃 마음 배달 완료
        </span>
      </p>

      {isLoggedIn === null ? (
        <div className="h-12 w-full" aria-hidden />
      ) : isLoggedIn ? (
        <div className="flex w-full gap-2">
          <button
            type="button"
            className="flex h-12 w-[115px] items-center justify-center rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-white)] px-7"
            onClick={handleBouquetShelfClick}
          >
            <span className="typo-body-1 whitespace-nowrap text-[var(--color-green-500)]">
              꽃다발 진열대
            </span>
          </button>
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[var(--color-green-400)] px-7"
            onClick={handleCreateBouquetClick}
          >
            <span className="typo-body-1 whitespace-nowrap text-[var(--color-white)]">
              꽃다발 만들기
            </span>
          </button>
        </div>
      ) : (
        <OauthButton />
      )}
    </div>
  );
}
