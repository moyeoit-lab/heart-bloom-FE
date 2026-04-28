"use client";

import { useCallback } from "react";

import { useSessionState } from "@/shared/hooks/useSessionState";

const STORAGE_KEY = "bouquetCreate.answers";

export type BouquetAnswers = Record<number, string>;

const EMPTY_ANSWERS: BouquetAnswers = {};

export const useBouquetAnswers = () => {
  const [answers, setAnswers] = useSessionState<BouquetAnswers>(
    STORAGE_KEY,
    EMPTY_ANSWERS,
  );

  const setAnswer = useCallback(
    (step: number, value: string) => {
      setAnswers((prev) => ({ ...prev, [step]: value }));
    },
    [setAnswers],
  );

  const clearAnswers = useCallback(() => {
    setAnswers(EMPTY_ANSWERS);
  }, [setAnswers]);

  return { answers, setAnswer, clearAnswers };
};
