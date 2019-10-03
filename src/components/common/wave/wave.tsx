import { EventEmitter } from "events";
import React, {
  FunctionComponent,
  Reducer,
  useEffect,
  useLayoutEffect,
  useReducer,
  useState,
  CSSProperties,
} from "react";

import styles from "./wave.module.css";

interface IWaveProps {
  eventEmitter: EventEmitter;
  colour: CSSProperties["color"];
}

/**
 * Create a click-explosion wave
 * Put this component inside a `relative`/`absolute` positioned element, and pass an EventEmitter.
 * Dispatch a `click` event to fire a new wave. The parent component will not be re-rendered.
 */
export const Wave: FunctionComponent<IWaveProps> = ({ eventEmitter, colour }) => {
  const [waves, dispatch] = useReducer<Reducer<number[], "ADD" | "REMOVE">>(reducer, []);

  useEffect(() => {
    let mounted = true;
    const eventHandler = () => {
      dispatch("ADD");
      setTimeout(() => {
        if (mounted) dispatch("REMOVE");
      }, 1000);
    };

    eventEmitter.addListener("click", eventHandler);
    return () => {
      mounted = false;
      eventEmitter.removeListener("click", eventHandler);
    };
  }, [eventEmitter]);

  return (
    <>
      {waves.map(id => (
        <WaveElement key={id} colour={colour} />
      ))}
    </>
  );
};

let counter = 0;
function reducer(state: number[], action: "ADD" | "REMOVE"): number[] {
  switch (action) {
    case "ADD":
      return [...state, counter++];
    case "REMOVE":
      return state.slice(1);
  }
}

const WaveElement: FunctionComponent<{ colour: CSSProperties["color"] }> = ({ colour }) => {
  const [active, setActive] = useState<boolean>(false);

  useLayoutEffect(() => {
    setActive(true);
  }, []);

  return (
    <div
      style={
        colour && {
          // @ts-ignore
          "--wave-colour": colour,
        }
      }
      className={active ? styles.waveElement : void 0}
    />
  );
};
