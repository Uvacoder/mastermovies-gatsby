import {
  AlignItemsProperty,
  FlexDirectionProperty,
  JustifyContentProperty,
} from "csstype";
import React, { FunctionComponent, HTMLAttributes } from "react";

type divProps = JSX.IntrinsicElements["div"];
export interface FlexProps extends divProps {
  align?: AlignItemsProperty;
  justify?: JustifyContentProperty;
  direction?: FlexDirectionProperty;
}

const defaultFlexProps: FlexProps = {
  align: "center",
  justify: "center",
  direction: null,
};

export const Flex: FunctionComponent<
  FlexProps & HTMLAttributes<HTMLDivElement>
> = props => {
  const { align, justify, direction, children, ...rest } = {
    ...defaultFlexProps,
    ...props,
  };
  return (
    <div
      {...rest}
      style={{
        display: "flex",
        alignItems: align,
        justifyContent: justify,
        flexDirection: direction,
      }}
    >
      {children}
    </div>
  );
};
