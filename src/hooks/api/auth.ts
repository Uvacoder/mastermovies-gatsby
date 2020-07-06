import { useEffect, useState } from "react";

import { Cancel, cancelTokenSource } from "../../lib/cancelToken";
import { getAuthPayload } from "../../services/api/auth";
import { humanError } from "../../services/api/error";
import { IHumanError } from "../../types/app";
import { IJwt } from "../../types/auth";
import { TRetryFunction } from "./request";

/** A React hook around the getAuthPayload function */
export function useAuthPayload(): [IJwt, IHumanError | undefined, TRetryFunction] {
  const [payload, setPayload] = useState<IJwt>();
  const [error, setError] = useState<any>();

  useEffect(() => {
    if (error) return;

    setPayload(void 0);
    setError(void 0);

    const { token, cancel } = cancelTokenSource();

    (async () => {
      try {
        const resolvedPayload = await getAuthPayload(token);
        if (!token.reason) setPayload(resolvedPayload);
      } catch (err) {
        if (err instanceof Cancel) return;

        setError(humanError(err));
      }
    })();

    return cancel;
  }, [error]);

  return [
    payload,
    error,
    () => {
      setError(void 0);
    },
  ];
}
