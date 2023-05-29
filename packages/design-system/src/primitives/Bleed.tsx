import React from "react";
import { View, ViewProps } from "react-native";

import { BoxProps } from "./Box/Box";
import { useInternalTheme } from "../hooks/useInternalTheme";
import { mapValues } from "../tools/mapValues";
import { RemoveStyle } from "../tools/useStyle";
import { SpaceKey } from "../types";

type BleedNumber = SpaceKey | { custom: number };
export type BleedProps = RemoveStyle<ViewProps> & {
  children: BoxProps["children"];
  space?: BleedNumber;
  top?: BleedNumber;
  bottom?: BleedNumber;
  left?: BleedNumber;
  right?: BleedNumber;
  horizontal?: BleedNumber;
  vertical?: BleedNumber;
  flex?: number;
};

/**
 * @description Renders a container with negative margins, allowing content
 * to "bleed" into the surrounding layout.
 */
export function Bleed({
  top,
  space,
  bottom,
  left,
  right,
  horizontal,
  vertical,
  children,
  flex,
  ...rest
}: BleedProps) {
  const theme = useInternalTheme();

  const marginValues = mapValues({ space, bottom, horizontal, left, right, top, vertical }, (value) => {
    if (typeof value === "object") {
      return -value.custom;
    }
    if (typeof value === "string") {
      const spaceValue = theme.spacing[value];
      if (spaceValue == null) {
        throw new Error("Invalid spacing value");
      }
      return -1 * spaceValue;
    }
    return undefined;
  });

  return (
    <View
      style={[
        {
          margin: marginValues.space,
          marginBottom: marginValues.bottom,
          marginHorizontal: marginValues.horizontal,
          marginLeft: marginValues.left,
          marginRight: marginValues.right,
          marginTop: marginValues.top,
          marginVertical: marginValues.vertical,
          flex,
        },
      ]}
      {...rest}
    >
      {children}
    </View>
  );
}
