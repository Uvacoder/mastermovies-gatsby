import { Button } from "antd";
import React from "react";

import { SEO } from "../components/common/seo";
import { Nav, ILink } from "../components/common/nav";

const links: ILink[] = [
  {text: "Home", link: "/"},
  {text: "Glacier", link: "/glacier"},
  {text: "API", link: "/docs"},
  {text: "Contact", link: "/contact"}
];

export default () =>  {
  return (
    <>
      <SEO
        title="Contact"
        keywords={[ "MasterMovies", "contact", "email", "form" ]}
      />
      <Nav links={links} type="fixed" extended />
      <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
        <div style={{ width: 400, maxWidth: "100vw", maxHeight: "100vh", textAlign: "center" }}>
          <h2>The contact form is currently unavailable</h2>
          <p style={{ textAlign: "justify" }}>Until we figure out how to use mail, please use the contact form on our old domain.</p>
          <a href="https://mastermovies.co.uk/?noredirect#contact"><Button type="primary" style={{ background: "#FF851B", borderColor: "#FF851B" }}>Take me there!</Button></a>
        </div>
      </div>
    </>
  )
}