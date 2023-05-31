import React, { ForwardedRef, forwardRef, useContext } from "react";
import { SectionList, SectionListProps as RNSectionListProps } from "react-native";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import {
  FilterStyles,
  RemoveStyles,
  ScrollableBoxProps,
  useResolveBoxListTokens,
} from "../../hooks/useResolveBoxListTokens";

type SectionListProps<T, S> = RemoveStyles<RNSectionListProps<T, S>> & {
  contentContainerStyle?: FilterStyles<RNSectionListProps<T, S>["contentContainerStyle"]>;
  style?: FilterStyles<RNSectionListProps<T, S>["style"]>;
};

export type SectionListBoxProps<T, S> = ScrollableBoxProps & SectionListProps<T, S>;

interface SectionComponentFunctionType {
  <T, S>(props: SectionListBoxProps<T, S>, ref: ForwardedRef<SectionList<T, S>>): JSX.Element;
}

export const SectionListBox = forwardRef(function SectionListBox<T, S>(
  { style, contentContainerStyle, ...props }: SectionListBoxProps<T, S>,
  ref: ForwardedRef<SectionList<T, S>>
) {
  const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
  const color = useContext(BackgroundContext);

  return (
    <BackgroundContext.Provider value={styles.backgroundColor ?? color}>
      <SectionList<T, S>
        ref={ref}
        contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
        style={[styles, style]}
        {...rest}
      />
    </BackgroundContext.Provider>
  );
}) as SectionComponentFunctionType;
