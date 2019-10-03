/** A CancelToken based on https://github.com/tc39/proposal-cancelable-promises */
export interface ICancelToken {
  /** Undefined if cancellation has not been requested, or an instance of Cancel if it has */
  reason?: Cancel;
  /** Resolves into the Cancel instance */
  promise: Promise<Cancel>;
  /** Throws the Cancel object if a cancel has been requested */
  throwIfRequested: () => void;
}

/** Used to cancel cancel a CancelToken */
export type TCancelFunction = (reason?: string) => void;

/** A Cancel "error" instance based on https://github.com/tc39/proposal-cancelable-promises */
export class Cancel extends Error {
  public message: string;

  constructor(reason?: string) {
    super();
    this.name = "Cancel";
    if (reason) this.message = reason;
  }
}

/** Generate a Cancel Token pair based on https://github.com/tc39/proposal-cancelable-promises */
export function cancelTokenSource(): { token: ICancelToken; cancel: TCancelFunction } {
  let sharedReason: Cancel;
  let promise: (reason?: any) => void;

  const token: ICancelToken = {
    promise: new Promise<Cancel>(resolve => {
      promise = resolve;
    }),
    throwIfRequested: () => {
      if (typeof sharedReason !== "undefined") throw sharedReason;
    },
  };

  const cancel = (reason?: string) => {
    token.reason = new Cancel(reason);
    sharedReason = token.reason;
    promise(sharedReason);
  };

  return {
    token,
    cancel,
  };
}
