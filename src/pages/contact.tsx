import React from "react";

import { SEO } from "../components/common/seo";
import { ContactBackground } from "../components/contact/background";
import { ContactApp } from "../containers/contact/app";

export default () => {
  return (
    <>
      <SEO title="Contact" keywords={["MasterMovies", "contact", "email", "form"]} />
      <div style={{ position: "relative" }}>
        <ContactBackground />
        <ContactApp />
      </div>
    </>
  );
};
