import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import React, { ForwardedRef, forwardRef, ReactNode, RefObject, ReactElement, useLayoutEffect } from "react";
import { FlatList, ScrollView, SectionList, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { Edge, SafeAreaViewProps } from "react-native-safe-area-context";

import { useGetBottomTabBarHeight, useGetHeaderHeight } from "../hooks/useGetNavigationHeights";
import { useInternalTheme } from "../hooks/useInternalTheme";
import { AnimatedFlatListBox, AnimatedFlatListBoxProps } from "../primitives/Box/AnimatedFlatListBox";
import { AnimatedScrollViewBox, AnimatedScrollViewBoxProps } from "../primitives/Box/AnimatedScrollViewBox";
import { Box, BoxProps } from "../primitives/Box/Box";
import { FlatListBox, FlatListBoxProps } from "../primitives/Box/FlatListBox";
import { SafeAreaBox } from "../primitives/Box/SafeAreaBox";
import { ScrollViewBox, ScrollViewBoxProps } from "../primitives/Box/ScrollViewBox";
import { SectionListBox, SectionListBoxProps } from "../primitives/Box/SectionListBox";

export type ScreenBaseProps = {
  options?: NativeStackNavigationOptions;
  mode?: SafeAreaViewProps["mode"];
  edges?: readonly ("top" | "bottom")[];
  backgroundComponent?: ReactElement | null;
  absolutePositionedTabBar?: boolean;
};

export type ScreenProps<T, S> = ScreenBaseProps &
  (
    | ({ as?: "View"; ref?: RefObject<View> } & BoxProps)
    | ({ as: "ScrollView"; ref?: RefObject<ScrollView> } & ScrollViewBoxProps)
    | ({ as: "AnimatedScrollView"; ref?: RefObject<Animated.ScrollView> } & AnimatedScrollViewBoxProps)
    | ({ as: "FlatList"; ref?: RefObject<FlatList> } & FlatListBoxProps<T>)
    | ({ as: "AnimatedFlatList"; ref?: RefObject<Animated.FlatList<T>> } & AnimatedFlatListBoxProps<T>)
    | ({ as: "SectionList"; ref?: RefObject<SectionList<T, S>> } & SectionListBoxProps<T, S>)
  );

interface ScreenComponentType {
  <T, S = any>(props: ScreenProps<T, S>, ref: ForwardedRef<any>): JSX.Element;
}

export const Screen = forwardRef(function Screen<T, S = any>(p: ScreenProps<T, S>, ref: ForwardedRef<any>) {
  const { defaults } = useInternalTheme();
  const navigation = useNavigation();
  const combinedProps = { ...defaults.Screen, ...p };
  const { options, mode, edges, backgroundComponent, backgroundColor, absolutePositionedTabBar, ...props } =
    combinedProps;

  useLayoutEffect(() => {
    if (options) {
      navigation.setOptions(options);
    }
  }, [navigation, options]);

  let headerHeight = useGetHeaderHeight();
  let bottomTabHeight = useGetBottomTabBarHeight();

  const customEdges = ["left", "right"] as Edge[];
  if (headerHeight === 0) {
    customEdges.push("top");
  }

  if (
    // getNavigationOptions()?.headerTransparent !== true &&
    options?.headerTransparent !== true
  ) {
    headerHeight = 0;
  }
  if (!absolutePositionedTabBar) {
    bottomTabHeight = 0;
  }

  if (bottomTabHeight === 0 || absolutePositionedTabBar) {
    customEdges.push("bottom");
  }

  const edgeArray = edges ?? customEdges;
  const containerprops = { backgroundColor, backgroundComponent };

  if (props.as === "ScrollView") {
    const { children, ...rest } = props;
    return (
      <ScreenContainer {...containerprops}>
        <ScrollViewBox ref={ref} flex={1} {...rest}>
          <SafeAreaBox
            edges={edgeArray}
            paddingTop={{ custom: headerHeight }}
            paddingBottom={{ custom: bottomTabHeight }}
            flex={1}
          >
            {children}
          </SafeAreaBox>
        </ScrollViewBox>
      </ScreenContainer>
    );
  }

  if (props.as === "AnimatedScrollView") {
    const { children, ...rest } = props;
    return (
      <ScreenContainer {...containerprops}>
        <AnimatedScrollViewBox ref={ref} flex={1} {...rest}>
          <SafeAreaBox
            edges={edgeArray}
            paddingTop={{ custom: headerHeight }}
            paddingBottom={{ custom: bottomTabHeight }}
            flex={1}
          >
            {children as ReactNode}
          </SafeAreaBox>
        </AnimatedScrollViewBox>
      </ScreenContainer>
    );
  }

  if (props.as === "FlatList") {
    const { children, ListHeaderComponent, ListFooterComponent, ...rest } = props;
    return (
      <ScreenContainer {...containerprops}>
        <FlatListBox
          ref={ref}
          flex={1}
          ListHeaderComponent={
            <SafeAreaBox
              edges={edgeArray.includes("top") ? ["top"] : ["left", "right"]}
              paddingTop={{ custom: headerHeight }}
            >
              <>{ListHeaderComponent}</>
            </SafeAreaBox>
          }
          ListFooterComponent={
            <SafeAreaBox
              edges={edgeArray.includes("bottom") ? ["bottom"] : ["left", "right"]}
              paddingBottom={{ custom: bottomTabHeight }}
            >
              <>{ListFooterComponent}</>
            </SafeAreaBox>
          }
          {...rest}
        />
      </ScreenContainer>
    );
  }

  if (props.as === "AnimatedFlatList") {
    const { children, ListHeaderComponent, ListFooterComponent, ...rest } = props;
    return (
      <ScreenContainer {...containerprops}>
        <AnimatedFlatListBox
          ref={ref}
          flex={1}
          ListHeaderComponent={
            <SafeAreaBox
              edges={edgeArray.includes("top") ? ["top"] : ["left", "right"]}
              paddingTop={{ custom: headerHeight }}
            >
              <>{ListHeaderComponent}</>
            </SafeAreaBox>
          }
          ListFooterComponent={
            <SafeAreaBox
              edges={edgeArray.includes("bottom") ? ["bottom"] : ["left", "right"]}
              paddingBottom={{ custom: bottomTabHeight }}
            >
              <>{ListFooterComponent}</>
            </SafeAreaBox>
          }
          {...rest}
        />
      </ScreenContainer>
    );
  }

  if (props.as === "SectionList") {
    const { children, ListHeaderComponent, ListFooterComponent, ...rest } = props;
    return (
      <ScreenContainer {...containerprops}>
        <SectionListBox
          ref={ref}
          flex={1}
          ListHeaderComponent={
            <SafeAreaBox
              edges={edgeArray.includes("top") ? ["top"] : ["left", "right"]}
              paddingTop={{ custom: headerHeight }}
            >
              <>{ListHeaderComponent}</>
            </SafeAreaBox>
          }
          ListFooterComponent={
            <SafeAreaBox
              edges={edgeArray.includes("bottom") ? ["bottom"] : ["left", "right"]}
              paddingBottom={{ custom: bottomTabHeight }}
            >
              <>{ListFooterComponent}</>
            </SafeAreaBox>
          }
          {...rest}
        />
      </ScreenContainer>
    );
  }

  if (!edgeArray?.length) {
    const { children, ...rest } = props;
    return (
      <ScreenContainer
        paddingTop={{ custom: headerHeight }}
        paddingBottom={{ custom: bottomTabHeight }}
        {...containerprops}
      >
        <Box flex={1} {...rest}>
          {children}
        </Box>
      </ScreenContainer>
    );
  }

  const { children, ...rest } = props;
  return (
    <ScreenContainer
      paddingTop={{ custom: headerHeight }}
      paddingBottom={{ custom: bottomTabHeight }}
      {...containerprops}
    >
      <SafeAreaBox edges={edgeArray} flex={1} {...rest}>
        {children}
      </SafeAreaBox>
    </ScreenContainer>
  );
}) as ScreenComponentType;

function ScreenContainer({
  backgroundColor,
  backgroundComponent,
  children,
  ...rest
}: {
  backgroundComponent?: ReactElement | null;
} & BoxProps) {
  return (
    <Box flex={1} backgroundColor={backgroundColor} {...rest}>
      {!!backgroundComponent && <Box style={StyleSheet.absoluteFill}>{backgroundComponent}</Box>}
      {children}
    </Box>
  );
}
