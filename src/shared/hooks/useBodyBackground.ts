"use client";

import { useEffect } from "react";

/**
 * iOS Safari의 status bar(배터리/와이파이 영역)까지 페이지 배경을 채우기 위해
 * 마운트 동안 body 요소에 클래스를 추가한다. layout.tsx의 viewport-fit=cover와 함께 사용.
 */
export function useBodyBackground(className: string | undefined) {
  useEffect(() => {
    if (!className) return;
    const classes = className.split(/\s+/).filter(Boolean);
    if (classes.length === 0) return;
    document.body.classList.add(...classes);
    return () => {
      document.body.classList.remove(...classes);
    };
  }, [className]);
}
