"use client";

import { useRef } from "react";

function useThrottle<Args extends unknown[], R extends void | undefined>(
  callback: (...args: Args) => R,
  delay: number,
): (...args: Args) => void {
  const lastRan = useRef(Date.now());
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return (...args: Args) => {
    const handler = () => {
      if (Date.now() - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = Date.now();
      } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(
          () => {
            callback(...args);
            lastRan.current = Date.now();
          },
          delay - (Date.now() - lastRan.current),
        );
      }
    };

    handler();
  };
}

export { useThrottle };
