import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";

/**
 * A React hook to listen get the window size and listen to changes.
 * An optional interval parameter lets you specify a maximum update frequency.
 */
export const useWindowSize: (interval?: number) => [number, number] = (interval: number = 0) => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [height, setHeight] = useState<number>(window.innerHeight);

  const callback = throttle(interval, () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
  });

  useEffect(() => {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
  }, []);

  return [width, height];
};
