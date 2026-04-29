"use client";

import { useCallback, useSyncExternalStore } from "react";

const isBrowser = () => typeof window !== "undefined";

const keyListeners = new Map<string, Set<() => void>>();

const subscribeToKey = (key: string, callback: () => void) => {
  if (!keyListeners.has(key)) keyListeners.set(key, new Set());
  const set = keyListeners.get(key)!;
  set.add(callback);
  return () => {
    set.delete(callback);
  };
};

const notifyKey = (key: string) => {
  keyListeners.get(key)?.forEach((cb) => cb());
};

const readRaw = (key: string): string | null =>
  isBrowser() ? window.sessionStorage.getItem(key) : null;

const parseOrFallback = <T>(raw: string | null, fallback: T): T => {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

type Updater<T> = T | ((prev: T) => T);

export const useSessionState = <T>(key: string, initial: T) => {
  const subscribe = useCallback(
    (callback: () => void) => {
      const unsubscribeInApp = subscribeToKey(key, callback);
      if (!isBrowser()) return unsubscribeInApp;
      const handler = (event: StorageEvent) => {
        if (event.key === key && event.storageArea === window.sessionStorage) {
          callback();
        }
      };
      window.addEventListener("storage", handler);
      return () => {
        unsubscribeInApp();
        window.removeEventListener("storage", handler);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => readRaw(key), [key]);
  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = parseOrFallback(raw, initial);

  const setValue = useCallback(
    (updater: Updater<T>) => {
      if (!isBrowser()) return;
      const current = parseOrFallback(readRaw(key), initial);
      const next =
        typeof updater === "function"
          ? (updater as (prev: T) => T)(current)
          : updater;
      window.sessionStorage.setItem(key, JSON.stringify(next));
      notifyKey(key);
    },
    [key, initial],
  );

  return [value, setValue] as const;
};
