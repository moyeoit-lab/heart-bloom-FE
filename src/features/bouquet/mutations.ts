"use client";

import { useMutation } from "@tanstack/react-query";

import { createSenderBouquet } from "@/features/bouquet/api";
import type {
  CreateSenderBouquetRequest,
  CreateSenderBouquetResponse,
} from "@/features/bouquet/types";

export const useCreateSenderBouquetMutation = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useMutation<
    CreateSenderBouquetResponse,
    Error,
    CreateSenderBouquetRequest
  >({
    mutationFn: (payload) => createSenderBouquet(apiUrl as string, payload),
  });
};
