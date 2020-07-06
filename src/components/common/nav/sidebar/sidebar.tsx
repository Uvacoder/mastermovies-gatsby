import classnames from "classnames";
import { navigate } from "gatsby";
import hash from "hash-sum";
import React, { useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useDrag } from "react-use-gesture";
import { ThemeContext } from "../../../../hooks/theme";
import { SmartLink } from "../../smart_link";
import { NavMenu } from "../common/menu";
import { INavProps } from "../nav";
import styles from "./sidebar.module.css";
import { SidebarImage } from "./sidebar_image";

const SIDEBAR_WIDTH = 400; /* see styles */
const SIDEBAR_MAX_WIDTH = 0.8; /* see styles */

const ENTER_DELAY = 200;
const STAGGER_DELAY = 100; // delay between stagger animations

const SPRING_PROPS = { friction: 20, tension: 200 };

const OPEN = 0;
const BREAKPOINT = -50;
const CLOSED = -100;

/** A powerful react-spring animated sidebar that supports drag-based open/close gestures */
export const Sidebar: React.FC<INavProps> = ({ links, logo }) => {
  // useSpring executes outside of React's rendering. This state provides real-time access
  // for animation logic. `active` state updates are pushed to React and done at a later time.
  const [gesture] = useState<{ active: boolean }>({ active: false });

  // Active state used for conventional React rendering
  const [active, setActive] = useState<boolean>(false);

  // Deferred image loading
  const [image, setImage] = useState<boolean>(false);

  const [{ x }, setSpring] = useSpring<{ x: number }>(() => ({
    x: CLOSED,
    config: {
      ...SPRING_PROPS,
      velocity: 0,
      gesture: false, // save w
    },
    onFrame: ({ x }) => {
      const shouldBeOpen = x >= BREAKPOINT;
      if (gesture.active !== shouldBeOpen) {
        gesture.active = shouldBeOpen;
        setActive(shouldBeOpen);
        setSpring({ x: shouldBeOpen ? OPEN : CLOSED });
        if (shouldBeOpen) {
          setImage(true); // deferred image loading
        }
      }
    },
  }));

  // The starting gesture position is stored in args
  const bind = useDrag(({ first, last, movement, vxvy, args }) => {
    if (first) {
      args[0] = clamp(x.getValue(), CLOSED, OPEN); // Save the initial `x` position
      setSpring({
        immediate: true,
        x: clamp(args[0] + (movement ? movement[0] / realSidebarWidth() : 0), CLOSED, OPEN),
      });
    } else if (last) {
      setSpring({
        immediate: false,
        x: gesture.active ? OPEN : CLOSED,
        config: {
          ...SPRING_PROPS,
          velocity: (vxvy[0] * 1000 * 100) / realSidebarWidth(), // 1000 is unit conversion, 100 is percent factor
        },
      });
    } else {
      setSpring({ x: clamp(args[0] + (movement ? movement[0] / realSidebarWidth() : 0) * 100, CLOSED, OPEN) });
    }
  });

  useEffect(() => {
    setSpring({
      x: active ? OPEN : CLOSED,
    });
  }, [active]);

  // Utility to calculate stagger delays
  const staggerDelay = (index: number, total: number, direction: boolean) => {
    let duration = direction ? index : total - (index + 1);
    duration *= STAGGER_DELAY * (direction ? 1 : 0.5); // shorter return
    duration += active ? ENTER_DELAY : 0; // add initial delay
    return `${duration}ms`;
  };

  // Link click handler
  const navigateTo = (destination: string) => {
    setActive(false);
    if (/^\/.*$/.test(destination)) {
      navigate(destination);
    } else {
      window.location.assign(destination);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        onClick={() => {
          setSpring({ x: !active ? OPEN : CLOSED });
          setActive(!active);
        }}
        className={classnames(styles.overlay, { [styles.shade]: active })}
      />
      <animated.div
        className={styles.sidebar}
        style={{
          transform: x.interpolate((x) => `translate3d(${clampInvert(x, CLOSED, OPEN)}%,0,0)`),
          boxShadow: x.interpolate(
            (x) =>
              `14px 0 28px rgba(0,0,0,${(0.2 * (x + 100)) / 100}), 10px 0 10px rgba(0,0,0,${(0.18 * (x + 100)) / 100})`
          ),
        }}
      >
        <ThemeContext.Consumer>
          {(theme) => (
            <ThemeContext.Provider value={active ? "light" : theme}>
              <NavMenu
                active={active}
                onClick={() => setActive(!active)}
                // delay={!active && !gestureActive ? EXIT_DELAY * 0.5 : 0}
                className={classnames(styles.menu, { [styles.exit]: !active })}
              />
            </ThemeContext.Provider>
          )}
        </ThemeContext.Consumer>

        <SidebarImage load={image} />

        <div
          {...bind()}
          className={classnames(styles.gestureTrigger, {
            [styles.disable]: active,
          })}
        />
        <div {...bind()} className={styles.content}>
          <SmartLink
            className={classnames(styles.logo, styles.stagger, {
              [styles.staggerIn]: active,
            })}
            style={{
              transitionDelay: staggerDelay(0, links.length + 1, active),
            }}
            link={logo.link}
          >
            {logo.text}
          </SmartLink>

          {links.map((link, index) => (
            <div
              key={hash(link)}
              className={classnames(styles.link, styles.stagger, {
                [styles.staggerIn]: active,
              })}
              style={{
                transitionDelay: staggerDelay(index + 1, links.length + 1, active),
              }}
              onClick={() => navigateTo(link.link)}
            >
              {link.text}
            </div>
          ))}
        </div>
      </animated.div>
    </div>
  );
};

/** Calculate the width of the sidebar to convert pixel transform to a percentage transform */
function realSidebarWidth() {
  // SSR doesn't have a window object, make one up
  return Math.min(SIDEBAR_WIDTH, (typeof window !== "undefined" ? window.innerWidth : 1280) * SIDEBAR_MAX_WIDTH);
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** If value exceeds MIN or MAX, it will be inverted around the exceed value. Useful for bounce. */
function clampInvert(value: number, min: number, max: number): number {
  if (value < min) return min + (min - value);

  if (value > max) return max - (value - max);

  return value;
}
