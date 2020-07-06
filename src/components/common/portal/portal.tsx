import ReactDOM from "react-dom";

/**
 * Use `Portal` to mount the component elsewhere in the DOM. Useful for Modals, dropdowns, any element
 * that needs to be detached from the main page. Requires ReactDOM!
 *
 * @example
 * // The Modal component will be mounted to document.getElementById("___portal"),
 * // instead of the regular React tree
 * <Portal nodeId="___portal">
 *   <Modal />
 * </Portal>
 */
export const Portal: React.FC<{ nodeId?: string }> = ({ nodeId = "___portal", children }) =>
  typeof document !== "undefined" ? ReactDOM.createPortal(children, document.getElementById(nodeId)) : null; // SSR
