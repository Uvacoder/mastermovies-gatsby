import AsyncLock from "async-lock";

export interface ISecureStore {
  /** Retrieve a value from the store, immediately releasing the lock */
  get: <V>(key: string) => Promise<V>;
  /** Obtain a lock on the key and update the value */
  set: <V>(key: string, newValue: V) => Promise<void>;
  /**
   * Low-level function to acquire a lock on a valu, allowing you to read and modify it
   * atomically. The lock is held until the provided callback returns, or if the callback returns
   * a Promise, once the Promise resolves.
   *
   * The update function may only be used while the lock is held.
   *
   * @returns {Promise} A Promise that resolves with the return value of the callback function
   *
   * @example
   * // The lock is obtained, and immediately released
   * store.acquire("key", (value, update) => value).then(value => { makeRequest(value); });
   * // Acquire the lock and update the value
   * store.acquire("key", (value, update) => { update(newValue); });
   */
  // acquire: <Value, Return = any, NewValue = Value>(
  //   key: string,
  //   callback: (value: Value, update: (newValue: NewValue) => void) => Return | Promise<Return>
  // ) => Promise<Return>;
  acquire<T, R, U = T>(key: string, fn: (value: T, update: (newValue: U) => void) => R | PromiseLike<R>): Promise<R>;
}

/* Creates a secure key/values store supporting locks */
export function createSecureStore(): ISecureStore {
  const store: { [index: string]: any } = {};
  const lock = new AsyncLock();

  const acquire: ISecureStore["acquire"] = (key, callback) => {
    // Create an update function that can be disabled
    let lockAcquired = false;
    const updater = (newValue: unknown) => {
      if (lockAcquired === true) {
        store[key] = newValue;
      } else {
        throw new Error("The lock has already been released");
      }
    };

    return lock.acquire(key, () => {
      lockAcquired = true;
      return Promise.resolve(callback(store[key], updater)).finally(() => {
        lockAcquired = false;
      });
    });
  };

  const get = <V>(key: string) => lock.acquire<V>(key, () => store[key]);

  const set = <V>(key: string, newValue: V) =>
    lock.acquire<any>(key, () => {
      store[key] = newValue;
    });

  return Object.freeze({
    acquire,
    get,
    set,
  });
}
