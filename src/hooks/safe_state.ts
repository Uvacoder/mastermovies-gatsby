import { useEffect, useState } from "react";

/**
 * Like React's useState, but silently ignores state updates if the component has already been unmounted.
 *
 * For example, you detect the unmount, and cancel a Axios HTTP request. Axios will synchronously throw an error.
 * If this gets saved to state, React will throw an error.
 *
 * This will silently reject state updates. Use only when you are sure you won't have a memory leak.
 */
export function useSafeState<S>(initialState?: S | (() => S)): [S, React.Dispatch<React.SetStateAction<S>>] {
  // Requires a small hack, object pointers for render-shared state and object mutation (bad man)
  const [mounted] = useState({ value: true }); // Shared across all re-renders
  useEffect(
    () => () => {
      mounted.value = false;
    },
    []
  );

  // Hold the state
  const [state, setState] = useState<S>(initialState);

  return [
    state,
    (...args) => {
      // Only update state if component is still mounted
      if (mounted.value === true) setState(...args);
    },
  ];
}
