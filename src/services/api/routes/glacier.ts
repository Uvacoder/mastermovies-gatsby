import { addQueryParams } from "./query";

export interface IApiGlacierList {
  sort_by?: "name" | "views" | "release";
  order_by?: "asc" | "desc";
  public?: boolean;
}

export interface IApiGlacierExport {
  download?: boolean;
  authorisation?: string;
}

export const GLACIER_PATHS = {
  ROOT: "/glacier",
  AUTHORISE: "/glacier/authorise",
  LIST: (params?: IApiGlacierList) => "/glacier/list" + addQueryParams(params),
  FILM: (id: number | string) => `/glacier/film/${id}`,
  THUMBNAIL: (id: number) => `/glacier/thumbnail/${id}`,
  EXPORT: (id: number) => `/glacier/export/${id}`,
  THUMBNAIL_STREAM: (id: number) => `/glacier/stream/thumbnail/${id}`,
  EXPORT_DOWNLOAD: (id: number, params?: IApiGlacierExport) => `/glacier/stream/export/${id}${addQueryParams(params)}`,
};
