import { GithubOutlined, WarningOutlined } from "@ant-design/icons";
import { graphql, useStaticQuery } from "gatsby";
import React, { Children } from "react";
import { AnimatedCheck } from "../../../../components/common/animated_check";
import { IconMargin } from "../../../../components/common/icon_margin";
import { MasterMoviesLogo, MasterMoviesText } from "../../../../components/common/logos";
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

export const StatusCardsSite: React.FC = () => {
  const { buildInformation } = useStaticQuery<{
    buildInformation: IBuildInformation;
    logo: IGraphQLFile;
  }>(graphql`
    query {
      buildInformation {
        version
        gitCommit
        gitDate
      }
    }
  `);

  return (
    <StatusCard>
      <Banner />
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
const Banner: React.FC = () => {
  return (
    <StatusCardRow align className={styles.banner}>
      <MasterMoviesLogo className={styles.logoImage} />
      <div className={styles.logo}>
        <MasterMoviesText className={styles.logoTitle} />
        <div className={styles.logoSubtitle}>hosted with SnowOwl</div>
      </div>
    </StatusCardRow>
  );
};

/** Displays build information, such as the version and commit hash */
const Build: React.FC<{ info: IBuildInformation }> = ({ info }) => {
  const production = process.env.NODE_ENV === "production";
  const [data, error] = useRequest<{ commit?: { sha: string } }>(
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
          <WarningOutlined className={styles.statusWarning} />
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
const Api: React.FC = () => {
  const [data, error] = useRequest("https://api.github.com/repos/MarcusCemes/mastermovies-api/branches/master");
  const [pkg] = useRequest("https://raw.githubusercontent.com/MarcusCemes/mastermovies-api/master/package.json");

  let version: string;
  try {
    if (typeof pkg === "object") version = (pkg as any).version;
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
      data && (data as any).commit ? (
        <>
          Build <code>{(data as any).commit.sha.substr(0, 7)}</code>
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
const Links: React.FC = () => (
  <StatusCardRow>
    <a href="https://github.com/MarcusCemes/mastermovies" target="_blank">
      <div className={styles.link}>
        <IconMargin icon={GithubOutlined} right /> Website repository
      </div>
    </a>
    <a href="https://github.com/MarcusCemes/mastermovies" target="_blank">
      <div className={styles.link}>
        <IconMargin icon={GithubOutlined} right /> API repository
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
