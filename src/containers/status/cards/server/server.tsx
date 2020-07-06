import React from "react";

import { AnimatedCheck } from "../../../../components/common/animated_check";
import {
  StatusCard,
  StatusCardDivider,
  StatusCardIcon,
  StatusCardRow,
  StatusCardSubText,
  StatusCardText,
} from "../card";

const STATUS_SIZE = 18;

// TODO add an API health check
export const StatusCardsServer: React.FC = () => {
  return (
    <StatusCard>
      <Server />
      <StatusCardDivider />
      <CDN />
    </StatusCard>
  );
};

/** Displays information about the server */
const Server: React.FC = () => (
  <StatusCardRow align>
    <StatusCardIcon>
      <AnimatedCheck active size={STATUS_SIZE} />
    </StatusCardIcon>
    <div>
      <StatusCardText>Everything seems fine</StatusCardText>
      <StatusCardSubText>SnowOwl</StatusCardSubText>
    </div>
  </StatusCardRow>
);

/** Displays Cloudflare information */
const CDN: React.FC = () => (
  <StatusCardRow align>
    <StatusCardIcon>
      <AnimatedCheck active size={STATUS_SIZE} />
    </StatusCardIcon>
    <div>
      <StatusCardText>Protected by Cloudflare</StatusCardText>
      <StatusCardSubText>Content Delivery Network</StatusCardSubText>
    </div>
  </StatusCardRow>
);
