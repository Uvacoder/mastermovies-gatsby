import { useEffect, useState } from "react";

import { Cancel, cancelTokenSource } from "../../lib/cancelToken";
import { humanError } from "../../services/api/error";
import { getData } from "../../services/api/request";
import { IHumanError } from "../../types/app";

export type TRetryFunction = () => void;

/**
 * A React hook around the getData function. Supports CSRF, 429 retry, cancelling, JSON
 * conversion, and in case of error, throws a IHumanError.
 */
export function useData<S extends {}>(
  path?: string,
  rawResponse: boolean = false
): [S | null | undefined, IHumanError | undefined, TRetryFunction] {
  const [resolvedData, setResolvedData] = useState<S | null>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (error) return;

    setResolvedData(void 0);
    setError(void 0);
    if (!path) return;

    const { token, cancel } = cancelTokenSource();

    (async () => {
      try {
        const data = await getData<S>(path, token, rawResponse);
        if (!token.reason) setResolvedData(data);
      } catch (err) {
        if (err instanceof Cancel) return;

        setError(humanError(err));
      }
    })();

    return cancel;
  }, [path, error]);

  return [
    resolvedData,
    error,
    () => {
      setError(void 0);
    },
  ];
}
