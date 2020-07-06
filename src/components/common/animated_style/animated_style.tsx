import React, { CSSProperties, ReactNode } from "react";
import { animated, AnimatedValue, useSpring } from "react-spring";

interface IAnimatedStyleProps {
  /** The initial starting conditions */
  from?: CSSProperties;
  /** The CSS properties to animate to */
  to: CSSProperties;
  /** The delay in `ms` */
  delay?: number;
  /** The speed multiplier (no exact timings) (default: 1.0) */
  speed?: number;
  /** Change the spring characteristics (default: 1.0) */
  dampingRatio?: number;
}

/**
 * Smoothly animate style properties over time with spring-like easing. The advantage
 * with this method is that animations can be interrupted at any time and return to
 * any state without resetting to the start value.
 *
 * If possible, children will be converted to react-spring's high-performance
 * `animated` element variants, will each child being animated individually.
 * This avoids the React render pipeline, and applies styling directly to the DOM.
 *
 * If not, each child will be wrapped in a shared div which will be animated instead.
 *
 * @example
 * // The <div /> element will be animated directly in the DOM without wrapping
 * <AnimatedStyle style={{ opacity: active ? 1 : 0}}>
 *   <div className={styles.container}>My content</div>
 * </AnimatedStyle>
 */
export const AnimatedStyle: React.FC<IAnimatedStyleProps> = ({
  from,
  to,
  delay = 0,
  speed = 1,
  dampingRatio = 1,
  children,
}) => {
  // Calculate mass, tension and (viscous) friction based on desired duration (for critical dampening)
  // https://en.wikipedia.org/wiki/Harmonic_oscillator
  const mass = 1;
  const tension = 170 * speed;
  const friction = dampingRatio * 2 * Math.sqrt(tension * mass);

  // Create the spring hook
  const spring = useSpring({
    from,
    to,
    delay,
    config: { mass, tension, friction },
  });

  return generateAnimatedElement(spring, children);
};

/** Attempt to convert ALL children to react-spring's animated variants, or wrap them all in a div */
function generateAnimatedElement(spring: AnimatedValue<any>, children: ReactNode) {
  // Try and convert known elements to animated variants (div => animated.div)
  try {
    return (
      <>
        {React.Children.map(children, (child) => {
          if (
            React.isValidElement(child) &&
            typeof child.type === "string" &&
            typeof animated[child.type] !== "undefined"
          ) {
            const AnimatedEquivilent = animated[child.type];
            return <AnimatedEquivilent {...child.props} style={spring} />;
          } else {
            throw new Error("Cannot be converted!");
          }
        })}
      </>
    );
  } catch (_err) {
    // Otherwise just wrap them in an extra div
    return <animated.div style={spring}>{children}</animated.div>;
  }
}
