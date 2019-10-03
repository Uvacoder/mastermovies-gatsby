import moment from "moment";
import { useContext, useEffect, useReducer, useState } from "react";

import { GlacierContext } from "../../containers/glacier/context";
import { IGlacierSearchBar } from "../../containers/glacier/layout/landing/search/bar";
import { IGlacierSearchFilter } from "../../containers/glacier/layout/landing/search/filter";
import { IGlacierSearchRange } from "../../containers/glacier/layout/landing/search/range";
import { Cancel, cancelTokenSource } from "../../lib/cancelToken";
import { getData } from "../../services/api/request";
import { API_PATHS } from "../../services/api/routes";
import { IGlacier, IGlacierSummary } from "../../types/glacier";
import { TRetryFunction } from "./request";

type TAction<K, V = void> = V extends void ? { type: K } : { type: K } & V;

/**
 * Fetches all Glacier film objects that match the context search query
 * @returns {[IGlacierSummary[], boolean, Error]} A list of search results, and a boolean indicating completeness
 */
export const useGlacierSearch = (films: IGlacierSummary[]): [IGlacierSummary[], boolean, Error, TRetryFunction] => {
  const [resolvedFilms, done, error, retry] = useFilms(films);

  const results = useGlacierFilter(resolvedFilms);

  return [results.map(filmToSummary), done, error, retry];
};

/** A React hook to retrieve Glacier film objects from summaries */
function useFilms(films: IGlacierSummary[]): [IGlacier[], boolean, Error, TRetryFunction] {
  const [filmStore, dispatch] = useReducer(filmStoreReducer, []);
  const [done, setDone] = useState<boolean>(false);
  const [error, setError] = useState<Error>(void 0);

  useEffect(() => {
    dispatch({ type: "CLEAR" });
    setDone(false);
    setError(void 0);

    const { token, cancel } = cancelTokenSource();

    // Fetch each film from the API and dispatch the data to the state - IMPROVMENT with Rxjs?
    // tslint:disable-next-line:no-floating-promises
    (async () => {
      try {
        await Promise.all(
          !films
            ? []
            : films.map(async film => {
                const data = await getData<IGlacier>(API_PATHS.GLACIER.FILM(film.id), token);
                dispatch({ type: "ADD", data });
              })
        );

        setDone(true);
      } catch (err) {
        if (err instanceof Cancel) return;
        setError(err);
      }
    })();

    return cancel;
  }, [films]);

  return [
    filmStore,
    done,
    error,
    () => {
      setError(void 0);
    },
  ];
}

type TFilmActions = TAction<"ADD", { data: IGlacier }> | TAction<"CLEAR">;

/** Manages the film store */
function filmStoreReducer(state: IGlacier[], action: TFilmActions) {
  switch (action.type) {
    case "ADD":
      for (const film of state) if (film.id === action.data.id) return state;
      return [...state, action.data];
    case "CLEAR":
      return [];
  }
}

/** A React hook to filter films based on the Glacier context */
function useGlacierFilter(films: IGlacier[]): IGlacier[] {
  const [{ filter, bar, range }] = useContext(GlacierContext);
  const [results, setResults] = useState<IGlacier[]>([]);

  /** Refresh the result set when necessary, by appending new result */
  useEffect(() => {
    setResults(films.filter(film => matchesFilter(film, filter, bar, range)));
  }, [films, filter, bar, range]);

  return results;
}

/** Attempts to match a film for all active filters */
function matchesFilter(
  film: IGlacier,
  filter: IGlacierSearchFilter,
  bar: IGlacierSearchBar,
  range: IGlacierSearchRange
): boolean {
  // Match filters
  const { filters } = filter;
  if (filters.onlyPublic && film.public === false) return false;

  // Match search term
  const { term } = bar;
  if (term !== "") {
    let matched = false;
    for (const field of [
      film.name,
      film.description,
      new Date(film.release).getFullYear(),
      film.crew,
      film.copyright,
      film.location,
    ]) {
      if (
        field &&
        String(field)
          .toLowerCase()
          .indexOf(term.toLowerCase()) !== -1
      ) {
        matched = true;
        break;
      }
    }
    if (!matched) return false;
  }

  // Match for date range
  if (range.range !== null) {
    const release = moment(film.release);
    if (release.isBefore(range.range[0]) || release.isAfter(range.range[1])) return false;
  }

  return true;
}

function filmToSummary(film: IGlacier): IGlacierSummary {
  return {
    id: film.id,
    name: film.name,
    release: film.release,
  };
}

/*

  const [results, dispatch] = useReducer<Reducer<IGlacier[], TAction>>(, []);

  // Handle all the search logic
  useEffect(() => {
    dispatch({ type: "CLEAR" });
    setDone(false);
    setError(null);

    if (!films) {
      setDone(true);
      return;
    }

    let cancelled = false;
    const cancelCallbacks = [
      () => {
        cancelled = true;
      },
    ];
    const promises: Array<Promise<void>> = [];

    // Fetch each film independently and dispatch the object
    for (const film of films) {
      const [request, cancel] = getData<IGlacier>(API.GLACIER.FILM(film.id));
      cancelCallbacks.push(cancel);

      promises.push(
        request.then(data => {
          if (!cancelled && matchesFilter(data, filter.filters, bar.term, range.range)) {
            dispatch({ type: "ADD", data });
          }
        })
      );
    }

    // Wait for total completion
    Promise.all(promises)
      .then(() => {
        if (!cancelled) setDone(true);
      })
      .catch(err => {
        if (!cancelled) setError(err);
      });

    // Cancel all requests
    return () => {
      for (const cb of cancelCallbacks) cb();
    };
  }, [films, filter.filters, bar.term, range.range]);

  return [results.map(filmToSummary), done, error];
  */
