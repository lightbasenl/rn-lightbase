import React, { Fragment, isValidElement, ReactElement, ReactNode } from "react";

import { Box } from "./Box/Box";
import { getValidChildren } from "../tools/getValidChildren";
import { Spacing } from "../types";

const alignHorizontalToFlexAlign = {
  center: "center",
  left: "flex-start",
  right: "flex-end",
  stretch: "stretch",
} as const;
type AlignHorizontal = keyof typeof alignHorizontalToFlexAlign;

const alignVerticalToFlexAlign = {
  bottom: "flex-end",
  center: "center",
  top: "flex-start",
} as const;

type AlignVertical = keyof typeof alignVerticalToFlexAlign;

export type StackProps = {
  children: ReactNode;
  alignHorizontal?: AlignHorizontal;
  alignVertical?: AlignVertical;
  flex?: number;
  space?: Spacing;
  separator?: ReactElement;
};

/**
 * @description Arranges child nodes vertically with equal spacing between
 * them, plus an optional `separator` element. Items can optionally be aligned
 * horizontally and/or vertically.
 */
export function Stack({ children, alignHorizontal, alignVertical, separator, space, flex }: StackProps) {
  if (__DEV__ && separator && !isValidElement(separator)) {
    throw new Error(`Stack: The 'separator' prop must be a React element`);
  }
  const validChildren = getValidChildren(children);

  const clones = validChildren.map((child, index) => {
    const key = typeof child.key !== "undefined" ? child.key : index;
    const isLast = index + 1 === validChildren.length;

    return (
      <Fragment key={key + "fragment"}>
        {child}
        {!!space && !isLast && <Box paddingBottom={space} />}
        {!!separator && !isLast && (
          <Box
            alignItems={alignHorizontal ? alignHorizontalToFlexAlign[alignHorizontal] : undefined}
            paddingBottom={space}
            width="100%"
          >
            {separator}
          </Box>
        )}
      </Fragment>
    );
  });

  return (
    <Box
      flex={flex}
      alignItems={alignHorizontal ? alignHorizontalToFlexAlign[alignHorizontal] : undefined}
      justifyContent={alignVertical ? alignVerticalToFlexAlign[alignVertical] : undefined}
    >
      {clones}
    </Box>
  );
}
