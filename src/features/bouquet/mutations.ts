"use client";

import { useMutation } from "@tanstack/react-query";

import {
  claimBouquetLink,
  completeBouquet,
  createBouquet,
} from "@/features/bouquet/api";
import type {
  ApiVoidResponse,
  CompleteBouquetRequest,
  CreateBouquetRequest,
  CreateBouquetResponse,
} from "@/features/bouquet/types";

export const useCreateBouquetMutation = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useMutation<CreateBouquetResponse, Error, CreateBouquetRequest>({
    mutationFn: (payload) => createBouquet(apiUrl as string, payload),
  });
};

export const useClaimBouquetMutation = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useMutation<ApiVoidResponse, Error, { token: string }>({
    mutationFn: ({ token }) => claimBouquetLink(apiUrl as string, token),
  });
};

export const useCompleteBouquetMutation = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  return useMutation<
    ApiVoidResponse,
    Error,
    { token: string; payload: CompleteBouquetRequest }
  >({
    mutationFn: ({ token, payload }) =>
      completeBouquet(apiUrl as string, token, payload),
  });
};
