"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

import { Button } from "@/components/Button";
import {
  bouquetKeys,
  useBouquetAlertsQuery,
  useReadBouquetAlertMutation,
  type BouquetAlertItem,
} from "@/features/bouquet";

const subscribeStorage = (onStoreChange: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  return () => window.removeEventListener("storage", onStoreChange);
};

const getLoginSnapshot = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return Boolean(window.localStorage.getItem("accessToken"));
};

export default function BouquetAlertOverlay() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const isLoggedIn = useSyncExternalStore(
    subscribeStorage,
    getLoginSnapshot,
    () => null,
  );
  const { data: alerts } = useBouquetAlertsQuery(Boolean(isLoggedIn));
  const latestAlert = useMemo(() => alerts?.[0], [alerts]);
  const [visibleAlert, setVisibleAlert] = useState<BouquetAlertItem | null>(null);
  const lastRequestedReadAlertIdRef = useRef<number | null>(null);
  const { mutate: readAlert } = useReadBouquetAlertMutation();

  useEffect(() => {
    if (!latestAlert || visibleAlert) {
      return;
    }
    setVisibleAlert(latestAlert);
  }, [latestAlert, visibleAlert]);

  useEffect(() => {
    if (!visibleAlert || lastRequestedReadAlertIdRef.current === visibleAlert.alertId) {
      return;
    }
    lastRequestedReadAlertIdRef.current = visibleAlert.alertId;

    readAlert(
      { alertId: visibleAlert.alertId },
      {
        onSettled: () => {
          queryClient.invalidateQueries({
            queryKey: bouquetKeys.alerts(apiUrl),
          });
        },
      },
    );
  }, [apiUrl, queryClient, readAlert, visibleAlert]);

  if (!isLoggedIn || !visibleAlert) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex w-full max-w-[430px] flex-col overflow-hidden bg-gradient-to-b from-[#f9f7de] to-[#fed8e1]">
      <div className="h-[44px] w-full shrink-0" aria-hidden />

      <section className="flex flex-1 flex-col items-center px-5 pb-safe-bottom">
        <div className="pt-16 text-center">
          <h2 className="typo-title-1 text-[var(--color-brown-300)]">
            <span className="text-[var(--color-red-400)]">{visibleAlert.displayName}</span>
            님이
            <br />
            꽃다발을 완성했어요
          </h2>
          <p className="typo-body-1 mt-4 whitespace-pre-line text-[var(--color-brown-300)]">
            서로의 마음이 담긴 꽃다발을{"\n"}확인해볼까요?
          </p>
        </div>

        <div className="relative mt-10 flex w-full flex-1 items-center justify-center">
          {visibleAlert.bouquetImageUrl ? (
            <img
              src={visibleAlert.bouquetImageUrl}
              alt={`${visibleAlert.displayName}님이 완성한 꽃다발`}
              className="h-auto max-h-[340px] w-[210px] object-contain"
            />
          ) : null}
          <span className="absolute text-[70px] leading-none text-[var(--color-red-400)]">?</span>
        </div>

        <div className="w-full pb-5 pt-4">
          <Button className="h-12 w-full" onClick={() => router.push("/bouquet")}>
            꽃다발 보러가기
          </Button>
        </div>
      </section>
    </div>
  );
}
