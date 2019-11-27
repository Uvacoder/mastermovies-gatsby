import React from "react";

import { Footer } from "../components/common/footer";
import { Nav } from "../components/common/nav";
import { SEO } from "../components/common/seo";
import { NAV_LINKS } from "../config";
import { StatusCards } from "../containers/status/cards";
import { StatusLayout } from "../containers/status/layout";

export default () => (
  <>
    <SEO title="Status" keywords={["status", "info"]} />
    <StatusLayout>
      <Nav links={NAV_LINKS} background />

      <StatusCards />

      <Footer />
    </StatusLayout>
  </>
);
