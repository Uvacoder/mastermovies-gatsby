import classnames from "classnames";
import React, { FunctionComponent, useContext } from "react";
import { TransitionGroup } from "react-transition-group";

import { FadeTransition } from "../../../../components/common/fade_transition";
import { Spinner } from "../../../../components/common/spinner";
import { StandardOverlay } from "../../../../components/common/standard_overlay";
import { useGlacierFilms } from "../../../../hooks/api/glacier";
import { useGlacierSearch } from "../../../../hooks/api/glacier_search";
import { humanError } from "../../../../services/api/error";
import { IHumanError } from "../../../../types/app";
import { IGlacierSummary } from "../../../../types/glacier";
import { GlacierContext } from "../../context";
import { GlacierBanner } from "./banner";
import { GlacierControls } from "./controls";
import { EGlacierSort } from "./controls/sort";
import { EGlacierLayout } from "./enum";
import { GlacierGrid } from "./grid";
import styles from "./landing.module.css";
import { GlacierList } from "./list";
import { GlacierResults } from "./results";
import { GlacierSearch } from "./search";
import { GlacierTitle } from "./title";

/** Provides easy browsing of Glacier films with a search bar */
export const GlacierLanding: FunctionComponent = () => {
  const [{ filter, bar, range, layout, sort }] = useContext(GlacierContext);

  const [films, error, retry] = useGlacierFilms({ sort_by: sort.by, order_by: sort.ascending ? "asc" : "desc" });

  const searchActive = [filter, bar, range].reduce((p, v) => p || v.active, false);

  const activeComponent = error ? (
    <ErrorLayout key={error.code || "error"} error={error} retry={retry} />
  ) : searchActive ? (
    <SearchLayout key="search" films={films} />
  ) : layout === EGlacierLayout.GRID ? (
    <GridLayout key="grid" films={films} />
  ) : (
    <ListLayout key="list" films={films} />
  );

  // enterDelay: Re-renders will debounce the delay, and search tends to re-render a lot
  return (
    <div>
      <GlacierSearch />

      <div className={styles.landingContent}>
        <TransitionGroup component={null}>
          <FadeTransition key={activeComponent.key} enterDelay={!searchActive ? 200 : void 0} absoluteOnExit>
            {activeComponent}
          </FadeTransition>
        </TransitionGroup>
      </div>
    </div>
  );
};

const ErrorLayout: FunctionComponent<{ error: IHumanError; retry: () => void }> = ({ error, retry }) => (
  <div style={{ minHeight: "60vh" }}>
    <StandardOverlay
      active
      text={error ? error.text : void 0}
      code={error ? error.code : void 0}
      icon={error.icon}
      button="Retry"
      onButton={retry}
    />
  </div>
);

const SearchLayout: FunctionComponent<{ films: IGlacierSummary[] }> = ({ films }) => {
  const [results, done, error, retry] = useGlacierSearch(films);
  const parsedError = error && humanError(error);

  return (
    <>
      <GlacierTitle>
        <div className={styles.searchSpinner}>
          <Spinner active={!done} size={32} />
        </div>
        Search results ({results.length})
      </GlacierTitle>
      <div className={styles.searchContent}>
        {error ? (
          <StandardOverlay
            active
            text={parsedError.text}
            code={parsedError.code}
            icon={parsedError.icon}
            button="Retry"
            onButton={retry}
          />
        ) : (
          <div className={styles.searchResults}>
            <GlacierResults results={results} />
          </div>
        )}
      </div>
    </>
  );
};

const GridLayout: FunctionComponent<{ films: IGlacierSummary[] }> = ({ films }) => {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerPadding} />
        <MainTitle />
        <div className={styles.layoutSelector}>
          <GlacierControls />
        </div>
      </div>
      <GlacierBanner films={films ? films.slice(0, 4) : void 0} />
      <GlacierTitle>Other Releases</GlacierTitle>
      <GlacierGrid films={films ? films.slice(4) : void 0} />
    </>
  );
};

const ListLayout: FunctionComponent<{ films: IGlacierSummary[] }> = ({ films }) => (
  <>
    <div className={styles.header}>
      <div className={styles.headerPadding} />
      <MainTitle />
      <div className={styles.layoutSelector}>
        <GlacierControls />
      </div>
    </div>
    <GlacierList films={films} />
  </>
);

const MainTitle: FunctionComponent = () => {
  const [{ sort }] = useContext(GlacierContext);
  return (
    <GlacierTitle className={styles.headerTitle}>
      {sort.by === EGlacierSort.NAME
        ? "Sorted by name"
        : sort.by === EGlacierSort.VIEWS
        ? "Popular Releases"
        : "Newest Releases"}
    </GlacierTitle>
  );
};
