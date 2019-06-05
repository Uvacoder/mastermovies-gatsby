import classnames from "classnames";
import { navigate } from "gatsby";
import hash from "hash-sum";
import React, { FunctionComponent, useEffect, useState } from "react";
import { animated, useSpring } from "react-spring";
import { useGesture } from "react-use-gesture";

import { SmartLink } from "../../smart_link";
import { NavMenu } from "../common/menu";
import { INavPropsWithState } from "../nav";
import styles from "./sidebar.module.css";
import { SidebarImage } from "./sidebar_image";

const SIDEBAR_WIDTH = 400; /* see styles */
const SIDEBAR_MAX_WIDTH = 0.8; /* see styles */

const ENTER_DELAY = 200;
const EXIT_DELAY = 400;
const STAGGER_DELAY = 100; // delay between stagger animations

const DEFAULT_SPRING_CONFIG = { mass: 1, tension: 170, friction: 26 };
const GESTURE_SPRING_CONFIG = { mass: 1, tension: 200, friction: 30 };


/** A powerful react-spring animated sidebar that supports drag-based open/close gestures */
export const Sidebar: FunctionComponent<INavPropsWithState> = ({
  links,
  theme,
  logo,
  type,
  sidebarOpen,
  setSidebarOpen,
}) => {
  // Create the state hooks
  const [immediate, setImmediate] = useState(false);
  const [gestureActive, setGestureActive] = useState(false);
  const [gesturePosition, setGesturePosition] = useState(0); // start gesture sidebar position
  const [releasedFromGesture, setReleasedFromGesture] = useState(false); // release the sidebar from gestures
  const [loadImage, setLoadImage] = useState(false); // defer lazy loading of the image

  // Create the animation engine
  const [{ x }, setX] = useSpring(() => ({
    x: -100,
    config: DEFAULT_SPRING_CONFIG,
    immediate: false,
  }));

  // Utility function to handle open/closing
  const setOpen = (open: boolean) => {
    if (!loadImage && open) setLoadImage(true);
    setX({
      x: open ? 0 : -100,
      config: DEFAULT_SPRING_CONFIG,
      immediate: false,
    });
  };

  // Handle opening/closing on manual state change, with a closing delay
  useEffect(() => {
    if (!gestureActive) {
      if (immediate || sidebarOpen) {
        setOpen(sidebarOpen);
      } else {
        const timeout = setTimeout(() => {
          setOpen(sidebarOpen);
        }, EXIT_DELAY);
        return () => clearTimeout(timeout);
      }
    }
  }, [sidebarOpen]);

  //* Create the gesture logic
  const bind = useGesture(({ first, last, delta, vxvy }) => {
    // Clean up the end of the gesture, reset to correct position
    if (last) {
      setGestureActive(false);
      setImmediate(false);
      if (releasedFromGesture) {
        setReleasedFromGesture(false); // position is already "fresh"
      } else {
        // If there's some movement, snap it to the other end, otherwise reset
        setOpen(
          Math.abs(vxvy[0]) > 0.25 ? (vxvy[0] > 0 ? true : false) : sidebarOpen
        );
      }
      return;
    }

    // Run when the gesture is first started
    if (first) {
      if (!loadImage) setLoadImage(true);
      setGestureActive(true);
      setGesturePosition(x.getValue());
      setImmediate(true);
      setSidebarOpen(x.getValue() > -50); // reset the state
    }

    // Handle real-time position based on gesture
    if (!releasedFromGesture && gestureActive) {
      // Update the state as it passed a threshold (centre)
      if (
        (sidebarOpen && x.getValue() < -50) ||
        (!sidebarOpen && x.getValue() > -50)
      ) {
        setSidebarOpen(x.getValue() > -50 ? true : false);
      }

      // If a certain x-velocity is exceeded, release and snap to open/closed
      if (Math.abs(vxvy[0]) > 1) {
        setReleasedFromGesture(true); // release the sidebar from further gestures
        setGestureActive(false);
        setSidebarOpen(vxvy[0] > 0 ? true : false);
        return;
      }

      // Otherwise respond to gestures
      const newX = Math.max(
        -100,
        Math.min(0, gesturePosition + (delta[0] / sidebarWidth()) * 100)
      );
      setX({ x: newX, config: GESTURE_SPRING_CONFIG, immediate: true });
    }
  });

  // Link click handler
  const navigateTo = (destination: string) => {
    setSidebarOpen(false); // In case the sidebar is hoisted above the router
    if (/^\/.*$/.test(destination)) {
      navigate(destination);
    } else {
      window.location.assign(destination);
    }
  };

  // Utility to calculate stagger delays
  const transitionDelay = (
    index: number,
    total: number,
    direction: boolean
  ) => {
    let duration = direction ? index : total - (index + 1);
    duration *= STAGGER_DELAY * (direction ? 1 : 0.5); // shorter return
    duration += sidebarOpen ? ENTER_DELAY : 0; // add initial delay
    return `${duration}ms`;
  };

  return (
    <div
      className={classnames(styles.wrapper, {
        [styles.fixed]: type === "fixed",
      })}
    >
      <div
        onClick={() => setSidebarOpen(false)}
        className={classnames(styles.overlay, { [styles.shade]: sidebarOpen })}
      />
      <animated.div
        className={styles.sidebar}
        style={{
          transform: x.interpolate(x => `translate3d(${x}%,0,0)`),
          boxShadow: x.interpolate(
            x =>
              `14px 0 28px rgba(0,0,0,${(0.2 * (x + 100)) /
                100}), 10px 0 10px rgba(0,0,0,${(0.18 * (x + 100)) / 100})`
          ),
        }}
      >
        <NavMenu
          onClick={() => setSidebarOpen(!sidebarOpen)}
          active={sidebarOpen}
          theme={sidebarOpen ? "light" : theme}
          delay={!sidebarOpen && !gestureActive ? EXIT_DELAY * 0.5 : 0}
          className={classnames(styles.menu, { [styles.exit]: !sidebarOpen })}
        />
        <SidebarImage load={loadImage} />

        <div
          {...bind()}
          className={classnames(styles.gestureTrigger, {
            [styles.disable]: sidebarOpen,
          })}
        />
        <div {...bind()} className={styles.content}>
          <SmartLink
            className={classnames(styles.logo, styles.stagger, {
              [styles.staggerIn]: sidebarOpen,
            })}
            style={{
              transitionDelay: transitionDelay(
                0,
                links.length + 1,
                sidebarOpen
              ),
            }}
            link={logo.link}
          >
            {logo.text}
          </SmartLink>

          {links.map((link, index) => (
            <div
              key={hash(link)}
              className={classnames(styles.link, styles.stagger, {
                [styles.staggerIn]: sidebarOpen,
              })}
              style={{
                transitionDelay: transitionDelay(
                  index + 1,
                  links.length + 1,
                  sidebarOpen
                ),
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
function sidebarWidth() {
  // SSR doesn't have a window object, make one up
  return Math.min(
    SIDEBAR_WIDTH,
    (typeof window !== "undefined" ? window.innerWidth : 1280) *
      SIDEBAR_MAX_WIDTH
  );
}
