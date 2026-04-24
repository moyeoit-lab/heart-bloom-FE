"use client";

import { useEffect, useState } from "react";
import OauthButton from "@/components/pages/home/OauthButton";

type HomeActionSectionProps = {
  onBouquetShelfClick?: () => void;
  onCreateBouquetClick?: () => void;
};

export default function HomeActionSection({
  onBouquetShelfClick,
  onCreateBouquetClick,
}: HomeActionSectionProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLoggedIn(Boolean(localStorage.getItem("accessToken")));
  }, []);

  const handleCreateBouquetClick = () => {
    if (onCreateBouquetClick) {
      onCreateBouquetClick();
      return;
    }

    if (typeof window !== "undefined") {
      window.location.href = "/bouquet/create";
    }
  };

  return (
    <div className="absolute left-0 top-[687px] flex w-full flex-col gap-2 px-5 pb-5">
      <p className="flex justify-center gap-[2px] text-center">
        <span className="typo-body-2-1 text-[var(--color-brown-200)]">
          지금까지{" "}
        </span>
        <span className="typo-body-2-2 text-[var(--color-red-400)]">
          123,409명
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
            className="flex h-12 w-[115px] items-center justify-center rounded-xl border border-[#e1e1e1] bg-white px-7"
            onClick={onBouquetShelfClick}
          >
            <span className="typo-body-1 whitespace-nowrap text-[#2f8657]">
              꽃다발 진열대
            </span>
          </button>
          <button
            type="button"
            className="flex h-12 flex-1 items-center justify-center rounded-xl bg-[#56a476] px-7"
            onClick={handleCreateBouquetClick}
          >
            <span className="typo-body-1 whitespace-nowrap text-white">
              꽃다발 만들기
            </span>
          </button>
        </div>
      ) : (
        <OauthButton provider="kakao" />
      )}
    </div>
  );
}
