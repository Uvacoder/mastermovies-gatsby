type TAnyFunction = (...args: any) => any;
type TCachedFunction<F extends TAnyFunction> = (...args: Parameters<F>) => ReturnType<F>;

/** Cache a functions result. The function only ever gets executed once. */
export function cached<F extends TAnyFunction>(fn: F): TCachedFunction<F> {
  let hasRun: boolean = false;
  let value: ReturnType<F>;

  return (...args: Parameters<F>) => {
    if (hasRun) return value;

    hasRun = true;
    // @ts-ignore Typings are to difficult for me
    return (value = fn(...args));
  };
}
