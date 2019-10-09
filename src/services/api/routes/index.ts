import { GLACIER_PATHS } from "./glacier";

const API_BASE = process.env.API_URL;

if (!API_BASE) {
  // tslint:disable-next-line:no-console
  console.warn("API_URL environmental variable is not set!");
}

/** Generates the full API URL from a relative path */
export function apiUrl(path: string): string {
  return API_BASE + (path || "");
}

/** Relative API paths,passed as an argument to apiUrl() */
export const API_PATHS = {
  ROOT: "/",
  OPEN_API: "/openapi.json",
  AUTH: {
    ROOT: "/auth",
    RESTORE: "/auth/restore",
    LOGOUT: "/auth/logout",
  },
  GLACIER: GLACIER_PATHS,
  SERVICES: {
    CONTACT: "/services/contact",
  },
};
