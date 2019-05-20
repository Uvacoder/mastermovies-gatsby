import axios, { CancelToken, CancelTokenSource } from "axios";

const API_BASE = "https://api.mastermovies.uk/v2"

export interface IGlacierFilmSummary {
  fingerprint: string;
  name: string;
  release: string;
  restricted: boolean;
  film_url: string;
}

export interface IGlacierFilm {
  fingerprint: string;
  name: string;
  release: string;
  restricted: boolean;
  description: string;
  location: string;
  copyright: string;
  views: number;
  exports: IGlacierFilmExport[];
  thumbnails: IGlacierFilmThumbnail[];
}

export interface IGlacierFilmExport {
  fingerprint: string;
  width: number;
  height: number;
  size: number | string; // it's type is casted from bigint
  mime: string;
  video_codec: string;
  audio_codec: string;
  stream_optimized: boolean;
  download_url: string;
  stream_url: string;
}

export interface IGlacierFilmThumbnail {
  fingerprint: string;
  width: number;
  height: number;
  mime: string;
  image_url: string;
}

interface ICacheQuery {
  promise: Promise<any>;
  state: boolean | null;
}

/** Contains API response cache */
const cache: { [index: string]: ICacheQuery } = {};

function fetchWithCache<T>(url: string, cancelToken?: CancelToken): Promise<T> {

  // Check the cache
  if (typeof cache[url] !== "undefined" && cache[url].state !== false)
    return cache[url].promise;

  // Run the query and update the query state
  const cacheEntry = { promise: void 0, state: null };
  const query = axios.get(url, { cancelToken })
    .then(result => { cacheEntry.state = true; return result.data; })
    .catch(err => { cacheEntry.state = false; throw err; });
  cacheEntry.promise = query;

  cache[url] = cacheEntry;
  return cacheEntry.promise;

}

export function createCancelToken(): CancelTokenSource {
  return axios.CancelToken.source();
}

export function getFilms(cancelToken: CancelToken, onlyPublic: boolean) {
  return fetchWithCache<IGlacierFilmSummary[]>(API_BASE + "/glacier/list" + (onlyPublic ? "?public" : ""), cancelToken);
}

export function getFilm(cancelToken: CancelToken, film: string) {
  return fetchWithCache<IGlacierFilm>(API_BASE + "/glacier/film/" + film, cancelToken);
}
