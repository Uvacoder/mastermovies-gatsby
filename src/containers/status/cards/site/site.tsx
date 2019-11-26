import { Icon } from "antd";
import { graphql, useStaticQuery } from "gatsby";
import React, { Children, FunctionComponent } from "react";

import { AnimatedCheck } from "../../../../components/common/animated_check";
import { IconMargin } from "../../../../components/common/icon_margin";
import { MasterMoviesLogo } from "../../../../components/common/logos";
import { Spinner } from "../../../../components/common/spinner";
import { useRequest } from "../../../../hooks/use_request";
import { IGraphQLFile } from "../../../../types/graphql";
import {
  StatusCard,
  StatusCardDivider,
  StatusCardIcon,
  StatusCardRow,
  StatusCardSubText,
  StatusCardText,
} from "../card";
import styles from "./site.module.css";

interface IBuildInformation {
  version: string | false;
  gitCommit: string | false;
  gitDate: number | false;
}

const STATUS_SIZE = 18;

export const StatusCardsSite: FunctionComponent = () => {
  const { buildInformation, logo } = useStaticQuery<{
    buildInformation: IBuildInformation;
    logo: IGraphQLFile;
  }>(graphql`
    query {
      buildInformation {
        version
        gitCommit
        gitDate
      }
      logo: file(relativePath: { eq: "logo/black.svg" }) {
        publicURL
      }
    }
  `);

  return (
    <StatusCard>
      <Banner logo={logo.publicURL} />
      <StatusCardDivider />
      <Build info={buildInformation} />
      <StatusCardDivider />
      <Api />
      <StatusCardDivider />
      <Links />
    </StatusCard>
  );
};

/** Displays the site logo */
const Banner: FunctionComponent<{ logo: string }> = ({ logo }) => {
  return (
    <StatusCardRow align className={styles.banner}>
      <img src={logo} className={styles.logoImage} />
      <div className={styles.logo}>
        <MasterMoviesLogo className={styles.logoTitle} />
        <div className={styles.logoSubtitle}>hosted with SnowOwl</div>
      </div>
    </StatusCardRow>
  );
};

/** Displays build information, such as the version and commit hash */
const Build: FunctionComponent<{ info: IBuildInformation }> = ({ info }) => {
  const production = process.env.NODE_ENV === "production";
  const [data, error] = useRequest(
    production ? "https://api.github.com/repos/MarcusCemes/mastermovies/branches/master" : null
  );
  const upToDate = data && data.commit ? data.commit.sha === info.gitCommit : null;

  const message = !production
    ? "Not running a production build"
    : error
    ? "Could not fetch upstream information"
    : !data
    ? "Fetching upstream information..."
    : upToDate
    ? "Everything is up to date"
    : "Running a non-official build";

  const subMessages = separate(
    Children.toArray([
      info.version ? `Version ${info.version}` : null,
      info.gitCommit ? (
        <>
          Build <code>{info.gitCommit.substr(0, 7)}</code>
          {upToDate ? " (Official Build)" : null}
        </>
      ) : null,
    ]),
    " – "
  );

  return (
    <StatusCardRow align>
      <StatusCardIcon>
        {production ? (
          <>
            <Spinner active={!data && !error} />
            <AnimatedCheck active={!!data || !!error} failed={!upToDate || !!error} size={STATUS_SIZE} />
          </>
        ) : (
          <Icon type="warning" className={styles.statusWarning} />
        )}
      </StatusCardIcon>
      <div>
        <StatusCardText children={message} />
        <StatusCardSubText children={subMessages} />
      </div>
    </StatusCardRow>
  );
};

/** Displays API information, such as version */
const Api: FunctionComponent = () => {
  const [data, error] = useRequest("https://api.github.com/repos/MarcusCemes/mastermovies-api/branches/master");
  const [pkg] = useRequest("https://raw.githubusercontent.com/MarcusCemes/mastermovies-api/master/package.json");

  let version: string;
  try {
    if (typeof pkg === "object") version = pkg.version;
  } catch (_err) {
    /* */
  }

  const message = error
    ? "Failed to retrieve API information"
    : data
    ? "API is compatible"
    : "Retrieving API information...";

  const subMessages = separate(
    Children.toArray([
      version ? `Version ${version}` : false,
      data && data.commit ? (
        <>
          Build <code>{data.commit.sha.substr(0, 7)}</code>
        </>
      ) : null,
    ]),
    " – "
  );

  return (
    <StatusCardRow align>
      <StatusCardIcon>
        <Spinner active={!data && !error} />
        <AnimatedCheck active={!!data || !!error} failed={!!error} size={18} />
      </StatusCardIcon>
      <div>
        <StatusCardText children={message} />
        <StatusCardSubText children={subMessages} />
      </div>
    </StatusCardRow>
  );
};
/** Links to source code repositories */
const Links: FunctionComponent = () => (
  <StatusCardRow>
    <a href="https://github.com/MarcusCemes/mastermovies" target="_blank">
      <div className={styles.link}>
        <IconMargin type="github" marginRight /> Website repository
      </div>
    </a>
    <a href="https://github.com/MarcusCemes/mastermovies" target="_blank">
      <div className={styles.link}>
        <IconMargin type="github" marginRight /> API repository
      </div>
    </a>
  </StatusCardRow>
);

/** Separate items in an array with a dividing value */
function separate<S, V>(array: S[], value: V): Array<S | V> {
  const newArray = [];
  for (let i = 0; i < array.length; i++) {
    newArray.push(array[i]);
    if (i !== array.length - 1) newArray.push(value);
  }
  return newArray;
}
