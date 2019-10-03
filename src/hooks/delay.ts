import { useEffect } from "react";

/** Execute a function with a delay */
export const useDelay = (delay: number, fn: () => any) =>
  useEffect(() => {
    const timeout = setTimeout(fn, delay);
    return () => clearTimeout(timeout);
  }, []);
