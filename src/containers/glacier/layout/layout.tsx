import { RouteComponentProps } from "@reach/router";
import React, { useEffect, useState } from "react";
import { Transition, TransitionGroup } from "react-transition-group";
import { FadeTransition } from "../../../components/common/fade_transition";
import { Footer } from "../../../components/common/footer";
import { GlacierText } from "../../../components/common/logos";
import { Nav } from "../../../components/common/nav";
import { NAV_LINKS } from "../../../config";
import { GlacierBackground } from "./background";
import { GlacierFilmInfo } from "./film_info";
import { GlacierIntro } from "./intro";
import { GlacierLanding } from "./landing";
import styles from "./layout.module.css";

enum EStage {
  START,
  INTRO,
  BACKGROUND,
  INTRO_END,
  CONTENT,
}

const TIMINGS: { [index in EStage]?: number } = {
  [EStage.INTRO]: 50,
  [EStage.BACKGROUND]: 800,
  [EStage.INTRO_END]: 2400,
  [EStage.CONTENT]: 2800,
};

const TRANSITION_PROPS = {
  unmountOnExit: true,
  timeout: {
    exit: 2000,
  },
};

interface IGlacierLayoutProps extends RouteComponentProps<{ film?: string; exp?: string }> {}

/** Handle the primary Glacier Intro/Layout */
export const GlacierLayout: React.FC<IGlacierLayoutProps> = ({ film, exp }) => {
  const [stage, setStage] = useState<EStage>(EStage.START);

  // Transitions
  useEffect(() => {
    const timings = Object.entries(TIMINGS).map(([newStage, delay]) =>
      setTimeout(() => setStage((newStage as unknown) as EStage), delay)
    );

    return () => timings.forEach(clearTimeout);
  }, []);

  return (
    <>
      <Transition {...TRANSITION_PROPS} in={stage >= EStage.BACKGROUND}>
        {(state) => <GlacierBackground active={state === "entered"} />}
      </Transition>

      <Transition {...TRANSITION_PROPS} in={stage >= EStage.INTRO && stage < EStage.INTRO_END}>
        {(state) => <GlacierIntro active={state === "entered"} />}
      </Transition>

      <Transition {...TRANSITION_PROPS} in={stage >= EStage.CONTENT}>
        {(state) => (
          <FadeTransition in={state === "entered"}>
            <div className={styles.layout}>
              <Nav links={NAV_LINKS} logo={{ link: "/glacier", text: <GlacierText /> }} extended />

              <LayoutContent film={film} exp={exp} />

              <Footer />
            </div>
          </FadeTransition>
        )}
      </Transition>
    </>
  );
};

const GlacierDownload: React.FC<{ exp: any }> = ({ exp }) => <span style={{ color: "white" }}>Export {exp}</span>;

const LayoutContent: React.FC<{ film?: string; exp?: string }> = ({ film, exp }) => {
  const component = film ? (
    <GlacierFilmInfo key={`film-${film}`} film={film} />
  ) : exp ? (
    <GlacierDownload key={`download-${exp}`} exp={exp} />
  ) : (
    <GlacierLanding key="landing" />
  );

  return (
    <div className={styles.layoutContent}>
      <TransitionGroup component={null}>
        <FadeTransition key={component.key} absoluteOnExit>
          {component}
        </FadeTransition>
      </TransitionGroup>
    </div>
  );
};
