import { Icon, Popover } from "antd";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { animated, useSpring, useTrail } from "react-spring";

import styles from "./moved.module.css";


export const Moved: FunctionComponent = () => {

  const [ show, setShow ] = useState(false);
  const [ copyVisible, setCopyVisible ] = useState(false);
  const [ copyError, setCopyError ] = useState(false);
  const [ trail, setTrail ] = useTrail(6 , () => ({ opacity: 0 }));

  // Open the overlay ONCE per app load
  useEffect(() => {
    const timeout = setTimeout(() => {
      const moved_banner_shown = sessionStorage.getItem("moved_banner_shown");
      if (!sessionStorage || moved_banner_shown !== "1") {
        setShow(true);
        // @ts-ignore Bad typings for react-spring
        setTrail({ opacity: 1, delay: 300 })
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  // Close the modal
  const close = () => {
    sessionStorage.setItem("moved_banner_shown", "1");
    setCopyVisible(false);
    setShow(false);
  }

  // ".co" shrinking animation
  const [ isShrunken, setShrunken ] = useState(false);
  const ref = useRef(null);
  const shrink = useSpring({
    opacity: isShrunken? 0 : 0.8,
    width: isShrunken ? 0 : ref.current? ref.current.getBoundingClientRect().width : 20,
    config: { tension: 15, friction: 10 }
  });


  // URL shrink animation after a delay
  useEffect(() => {
    const timeout = setTimeout(() => setShrunken(true), 2500);
    return () => clearTimeout(timeout);
  }, []);


  // Copy new URL to clipboard when clicking on the dummy address bar
  const copy = () => {
    navigator.clipboard.writeText("https://mastermovies.uk")
      .then(() => { setCopyError(false); setCopyVisible(true); })
      .catch(() => { setCopyError(true); setCopyVisible(true); });
  }

  const copySuccessElement = <span><Icon type="check-circle" style={{color: "#2ECC40", marginRight: 8}} />Copied to your clipboard!</span>
  const copyErrorElement = <span><Icon type="exclamation-circle" style={{color: "#FF4136", marginRight: 8}} />Your browser doesn't support the Clipboard API</span>

  // Close the popover after some time
  useEffect(() => {
    if (copyVisible !== null) {
      const timeout = setTimeout(() => setCopyVisible(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [copyVisible]);

  // Disable in SSR
  if (typeof window !== "undefined" && window.location.search.indexOf("moved") === -1) return null;

  return (
    <div className={styles.root} data-active={show? "" : void 0}>
    <div className={styles.overlay} onClick={close} />
      <div className={styles.container}>

        <Icon type="close-circle" className={styles.close} onClick={close} />

        <animated.h1 style={trail[0]} className={styles.title}>We've moved!</animated.h1>
        <animated.h3 style={trail[1]} className={styles.subtitle}>New domain. New look.</animated.h3>

        <br />

        <animated.p style={trail[2]} className={styles.justify}>
          We've taken the liberty of automagically forwarding you to our new domain!
          Our choice to adopt the shorter <b>.uk</b> domain ending makes a punchier and more memorable name,
          while at the same time allowing us to move to a more flexible web host that uses more modern technologies.
        </animated.p>

        <animated.p style={trail[3]} className={styles.justify}>
          You may continue to use the old website until <b>17th June 2019</b>,
          by appending <i><a href="https://mastermovies.co.uk/?noredirect">?noredirect</a></i> to the old URL.
          In case you forget, your browser should remember to redirect you here, even after the expiration date.
        </animated.p>

        <Popover content={copyError? copyErrorElement : copySuccessElement} visible={copyVisible} placement="bottom">
          <animated.div style={trail[4]} className={styles.addressBar} onClick={copy}>
            <Icon type="arrow-left" className={styles.addressBarIcon} />
            <Icon type="arrow-right" className={styles.addressBarIcon} />
            <Icon type="reload" className={styles.addressBarIcon} />
            <Icon type="home" className={styles.addressBarIcon} />
            <div className={styles.urlBar}>
              <span className={styles.urlSecure}>
                <Icon type="lock" theme="filled" />
                &nbsp;&nbsp;
                https://</span>mastermovies
                <animated.span ref={ref} style={shrink} className={styles.shrink}>.co</animated.span><b>.uk</b>
            </div>
            <Icon type="menu" className={styles.addressBarIcon} />
          </animated.div>
        </Popover>

        <animated.span style={trail[5]} className={styles.closeMessage}>Click anywhere outside the box to close</animated.span>
      </div>
    </div>
  );

}