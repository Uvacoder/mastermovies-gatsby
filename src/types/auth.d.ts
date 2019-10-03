interface IBasicJwtProperties {
  iat?: number;
  exp?: number;
  aud?: string;
  jti?: string;
}

// TODO improve
/** A MasterMovies API session context */
export interface IJwt extends IBasicJwtProperties {
  glacier?: {
    /** Contains expiry in UNIX seconds timestamp */
    auth?: { [index: number]: number };
  };
}
