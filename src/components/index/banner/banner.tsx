import Img, { FluidObject } from "gatsby-image";
import React, { FunctionComponent } from "react";

import { Cover } from "../../common/cover";
import { Flex } from "../../common/flex";
import styles from "./banner.module.css";

const { root, title, subtitle, logo } = styles;

type divProps = JSX.IntrinsicElements["div"];
interface BannerProps extends divProps {
  background: FluidObject;
  logoURL: string;
}

export const Banner: FunctionComponent<BannerProps> = ({
  background,
  logoURL,
  ...rest
}) => (
  <Flex {...rest} className={root}>
    <Cover>
      <Img fluid={background} />
    </Cover>
    <Flex direction="column">
      <img className={logo} src={logoURL} />
      <h1 className={title}>MASTERMOVIES</h1>
      <h2 className={subtitle}>SMALL MEDIA STUDIO</h2>
    </Flex>
  </Flex>
);
