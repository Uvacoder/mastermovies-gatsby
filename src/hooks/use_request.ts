import Axios, { AxiosRequestConfig } from "axios";
import { useEffect, useState } from "react";

import { Cancel, cancelTokenSource } from "../lib/cancelToken";
import { humanError } from "../services/api/error";
import { IHumanError } from "../types/app";

export type TRetryFunction = () => void;

/**
 * A React hook around the used to conduct Axios requests
 */
export function useRequest<S extends any>(
  url?: string,
  config?: AxiosRequestConfig
): [S | null | undefined, IHumanError | undefined, TRetryFunction] {
  const [resolvedData, setResolvedData] = useState<S | null>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (error) return;

    setResolvedData(void 0);
    setError(void 0);
    if (!url) return;

    const { token, cancel } = cancelTokenSource();

    (async () => {
      try {
        const response = await Axios.request<S>({ url, ...config });
        if (!token.reason) setResolvedData(response.data);
      } catch (err) {
        if (err instanceof Cancel) return;

        setError(humanError(err));
      }
    })();

    return cancel;
  }, [url, error]);

  return [
    resolvedData,
    error,
    () => {
      setError(void 0);
    },
  ];
}
