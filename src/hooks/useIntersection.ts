"use client";

import { useEffect, useRef } from "react";

/**
 * 노드가 viewport 에 들어오면 콜백 호출.
 *
 * 무한 스크롤 sentinel 용. 콜백이 안정적이라는 가정 (useCallback 으로 래핑 권장).
 */
export function useIntersection<T extends HTMLElement>(
  onIntersect: () => void,
  options: IntersectionObserverInit = { rootMargin: "200px" },
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onIntersect();
      },
      options,
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [onIntersect, options]);

  return ref;
}
