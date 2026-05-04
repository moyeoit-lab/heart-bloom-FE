"use client";

import { useEffect } from "react";

/**
 * iOS Safari의 status bar(노치 / Dynamic Island / 배터리·와이파이 영역)까지
 * 페이지 배경을 채우기 위해 마운트 동안 html과 body 모두에 클래스를 추가한다.
 * 노치 영역의 색은 <html> 배경이 결정하므로 documentElement에도 함께 적용해야 한다.
 * layout.tsx의 viewport-fit=cover와 함께 사용.
 */
export function useBodyBackground(className: string | undefined) {
  useEffect(() => {
    if (!className) return;
    const classes = className.split(/\s+/).filter(Boolean);
    if (classes.length === 0) return;
    const html = document.documentElement;
    const body = document.body;
    html.classList.add(...classes);
    body.classList.add(...classes);
    return () => {
      html.classList.remove(...classes);
      body.classList.remove(...classes);
    };
  }, [className]);
}
