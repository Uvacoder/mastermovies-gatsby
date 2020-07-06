import React, { useRef } from "react";
import { animated, useSpring } from "react-spring";
import { Transition } from "react-transition-group";

interface IFadeTransition extends ICustomProps {
  in?: boolean;
  unmountOnExit?: boolean;
}

interface ICustomProps {
  /** The spring speed multiplier */
  speed?: number;
  /** The spring damping ratio (default: 1.0) */
  dampingRatio?: number;
  /**
   * Switch to absolute positioning when not entered, `overflow: hidden` is recommended on parent.
   *
   * Useful for transitioning between overlapping components.
   */
  absoluteOnExit?: boolean;
  enterDelay?: number;
}

const ABSOLUTE_PROPS = { position: "absolute", top: 0, left: 0, right: 0, pointerEvents: "none" };
const RELATIVE_PROPS = { position: "relative" };

/**
 * A react-spring fade transition.
 * Compatible with react-transition-group. Supports multiple children.
 * Simple elements (such as divs, spans) will be augmented to react-spring's
 * high-performance `animated` variants, complex components will be wrapped
 * in a div.
 */
export const FadeTransition: React.FC<IFadeTransition> = ({
  children,
  speed = 1,
  dampingRatio = 1,
  absoluteOnExit = false,
  enterDelay,
  ...rest
}) => (
  <Transition
    {...rest}
    timeout={4000}
    // @ts-ignore Bad library typings
    addEndListener={(node: HTMLElement, done: () => void) => {
      node.addEventListener("transitioned", () => setTimeout(done, 1000), false);
    }}
  >
    {(state) => (
      <FadeSpring
        active={state === "entering" || state === "entered"}
        speed={speed}
        dampingRatio={dampingRatio}
        absoluteOnExit={absoluteOnExit}
        enterDelay={enterDelay}
      >
        {children}
      </FadeSpring>
    )}
  </Transition>
);

const FadeSpring: React.FC<{ active: boolean } & ICustomProps> = ({
  children,
  active,
  speed,
  dampingRatio,
  absoluteOnExit,
  enterDelay,
}) => {
  // Calculate mass, tension and (viscous) friction based on desired duration (for critical dampening)
  // https://en.wikipedia.org/wiki/Harmonic_oscillator
  const mass = 1;
  const tension = 170 * speed;
  const friction = dampingRatio * 2 * Math.sqrt(tension * mass);
  const ref = useRef(null);
  const spring = useSpring({
    to: { opacity: active ? 1 : 0 },
    config: { mass, tension, friction },
    onRest: () => {
      if (ref.current) (ref.current as HTMLElement).dispatchEvent(new Event("transitioned"));
    },
    delay: enterDelay && active ? enterDelay : void 0,
  });

  const augmentedSpring = absoluteOnExit
    ? active
      ? { ...spring, ...RELATIVE_PROPS }
      : { ...spring, ...ABSOLUTE_PROPS }
    : spring;

  // Try to convert child to react-spring animated equivalent element
  return (
    <>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          typeof child.type === "string" &&
          typeof animated[child.type] !== "undefined"
        ) {
          const AnimatedEquivalent = animated[child.type];
          return <AnimatedEquivalent ref={ref} {...child.props} style={{ ...child.props.style, ...augmentedSpring }} />;
        } else {
          return (
            <animated.div ref={ref} style={augmentedSpring}>
              {child}
            </animated.div>
          );
        }
      })}
    </>
  );
};
