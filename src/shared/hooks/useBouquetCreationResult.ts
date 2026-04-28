"use client";

import { useCallback } from "react";

import { useSessionState } from "@/shared/hooks/useSessionState";

const STORAGE_KEY = "bouquetCreate.result";

export type BouquetCreationResult = {
  bouquetId: number;
  linkToken: string;
};

const EMPTY_RESULT: BouquetCreationResult | null = null;

export const useBouquetCreationResult = () => {
  const [result, setResult] = useSessionState<BouquetCreationResult | null>(
    STORAGE_KEY,
    EMPTY_RESULT,
  );

  const clearResult = useCallback(() => {
    setResult(EMPTY_RESULT);
  }, [setResult]);

  return { result, setResult, clearResult };
};
