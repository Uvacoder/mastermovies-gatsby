/**
 * A universal app error, designed for UI presentation. Contains a human
 * readable message, a technical code, and an antd compatible icon name.
 */
export interface IHumanError {
  /** A short and human readable error message */
  text: string;
  /**
   * A short technical identifier for the error, such as `429 Too Many Requests`.
   * This should be rendered in a monospace font.
   */
  code?: string;
  /** An icon identifier that should be resolvable by the antd library */
  icon?: string;
}
