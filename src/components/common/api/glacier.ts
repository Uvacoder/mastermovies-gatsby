import axios, { CancelToken } from "axios";
import { API_BASE } from "./common";

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


function fetch<T>(url: string, cancelToken?: CancelToken): Promise<T> {
  return axios.get(url, { cancelToken }).then(result => result.data);
}

export function getFilms(cancelToken: CancelToken, onlyPublic: boolean) {
  return fetch<IGlacierFilmSummary[]>(
    API_BASE + "/glacier/list" + (onlyPublic ? "?public" : ""),
    cancelToken
  );
}

export function getFilm(cancelToken: CancelToken, film: string) {
  return fetch<IGlacierFilm>(
    API_BASE + "/glacier/film/" + film,
    cancelToken
  );
}
