import React, { FunctionComponent } from "react";

type svgProps = JSX.IntrinsicElements["svg"];

export const QuoteIcon: FunctionComponent<svgProps> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="0 0 100 100" {...props}>
    <g>
      <path d="M23 56a11 11 0 1 0 13-11c2-5 6-8 11-8v-4c-13 0-23 10-24 23zM53 56a11 11 0 1 0 13-11c1-5 6-8 11-8v-4c-13 0-24 10-24 23z" />
    </g>
  </svg>
);
