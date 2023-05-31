import React, { ForwardedRef, forwardRef, useContext } from "react";
import { ScrollViewProps as RNScrollViewProps } from "react-native";
import Animated, { AnimateProps } from "react-native-reanimated";

import { BackgroundContext } from "../../hooks/useBackgroundColor";
import {
  FilterStyles,
  RemoveStyles,
  ScrollableBoxProps,
  useResolveBoxListTokens,
} from "../../hooks/useResolveBoxListTokens";

type ScrollViewProps = RemoveStyles<RNScrollViewProps> & {
  contentContainerStyle?: FilterStyles<RNScrollViewProps["contentContainerStyle"]>;
  style?: FilterStyles<RNScrollViewProps["style"]>;
};

export type AnimatedScrollViewBoxProps = ScrollableBoxProps & AnimateProps<ScrollViewProps>;

export const AnimatedScrollViewBox = forwardRef(function ScrollViewBox(
  { style, contentContainerStyle, ...props }: AnimatedScrollViewBoxProps,
  ref: ForwardedRef<Animated.ScrollView>
) {
  const { contentContainerStyles, styles, ...rest } = useResolveBoxListTokens(props);
  const color = useContext(BackgroundContext);

  return (
    <BackgroundContext.Provider value={styles.backgroundColor ?? color}>
      <Animated.ScrollView
        ref={ref as ForwardedRef<Animated.ScrollView>}
        contentContainerStyle={[contentContainerStyles, contentContainerStyle]}
        style={[styles, style]}
        {...rest}
      />
    </BackgroundContext.Provider>
  );
});
