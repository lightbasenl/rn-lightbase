import tinycolor from "@ctrl/tinycolor";
import * as React from "react";
import { createContext, useCallback, useContext, useMemo } from "react";
import { ActivityIndicator, Pressable, PressableProps, PressableStateCallbackType } from "react-native";
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { Text, TextProps } from "./Text";
import { useBackgroundColor } from "../hooks/useBackgroundColor";
import { useInternalTheme } from "../hooks/useInternalTheme";
import { useResolveBoxTokens } from "../hooks/useResolveBoxTokens";
import { useResolveColorToken } from "../hooks/useResolveColorToken";
import { AnimatedBox } from "../primitives/Box/AnimatedBox";
import type { BoxProps } from "../primitives/Box/Box";
import { Row, RowProps } from "../primitives/Row";
import { getActiveColor } from "../tools/colorUtils";
import { getButtonVariants } from "../tools/getButtonVariants";
import type { ButtonVariants, ColorThemeKeys } from "../types";

type OmittedBoxProps = Omit<
  BoxProps,
  "alignItems" | "alignSelf" | "flexDirection" | "flexWrap" | "justifyContent" | "style"
>;

type ButtonSpecificProps = {
  variant?: ButtonVariants;
  textColor?: TextProps["color"];
  onPressBorderColor?: ColorThemeKeys | null;
  onPressColor?: ColorThemeKeys | null;
  themeColor?: ColorThemeKeys | null;
  textVariant?: TextProps["variant"];
  /**
   * Row Props
   */
  space?: RowProps["space"];
  alignVertical?: RowProps["alignVertical"];
  alignHorizontal?: RowProps["alignHorizontal"];
  /**
   * ReanimatedV2 value representing the scale of the Button when onPressIn is trigger
   * @default 0.99
   */
  onPressAnimatedScale?: number;
  /**
   * If true, the button will show a spinner instead of the children components
   */
  isLoading?: boolean;
  LoadingComponent?: JSX.Element;
};
export type ButtonProps = PressableProps & OmittedBoxProps & ButtonSpecificProps;

const ButtonContext = createContext<Partial<ButtonProps> | null>(null);
function useButtonContext() {
  const variant = useContext(ButtonContext);
  if (!variant) {
    throw new Error("Button variant has not been defined");
  }
  return variant;
}

export function Button({
  variant,
  themeColor,
  isLoading,
  children,
  LoadingComponent,
  ...props
}: ButtonProps) {
  const theme = useInternalTheme();
  const parentBackGroundColor = useBackgroundColor();

  const resolveThemeColor = useResolveColorToken();

  const defaultVariant = variant ?? theme.defaults.Button.variant ?? "solid";

  const variants = useMemo(
    () =>
      getButtonVariants({
        themeColor: themeColor ?? theme.defaults.Button.themeColor,
        parentBackGroundColor,
        resolveThemeColor,
        overrides: theme.variants.Button,
        defaultProps: theme.defaults.Button,
        variant: defaultVariant,
      }),
    [
      themeColor,
      theme.defaults.Button,
      theme.variants.Button,
      parentBackGroundColor,
      resolveThemeColor,
      defaultVariant,
    ]
  );

  const combinedProps = { ...variants, ...props };

  const {
    onPressAnimatedScale,
    onPress,
    disabled,
    onPressColor,
    onPressBorderColor,
    style,
    space,
    alignVertical = "center",
    alignHorizontal = "center",
    ...remainingProps
  } = combinedProps;

  const {
    tokenStyles: { borderColor, backgroundColor, ...tokens },
    paddingValues,
    ...rest
  } = useResolveBoxTokens(remainingProps);

  const pressColor = onPressColor
    ? resolveThemeColor(onPressColor)
    : getActiveColor(backgroundColor ?? parentBackGroundColor);

  const pressBorderColor = resolveThemeColor(onPressBorderColor ?? { custom: pressColor });
  const resolvedBackgroundColor = backgroundColor ?? parentBackGroundColor;
  const resolvedBorderColor = borderColor ?? resolvedBackgroundColor;

  const anim = useSharedValue(0);
  const animateTo = (toValue: number, duration: number) => {
    anim.value = withTiming(toValue, {
      duration,
      easing: Easing.inOut(Easing.quad),
    });
  };

  const handlePressIn = () => {
    animateTo(1, 200);
  };

  const handlePressOut = () => {
    animateTo(0, 200);
  };

  const endBackgroundColor = tinycolor(pressColor).toHex8String();
  const startBackgroundColor =
    resolvedBackgroundColor === "transparent"
      ? tinycolor(pressColor).setAlpha(0).toHex8String()
      : resolvedBackgroundColor;

  const animatedBackgroundColor = useDerivedValue(() => {
    if (onPressColor !== null) {
      const value = interpolateColor(anim.value, [0, 1], [startBackgroundColor, endBackgroundColor]);
      return value;
    }
    return undefined;
  }, [anim.value, endBackgroundColor, onPressColor, startBackgroundColor]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedBackgroundColor.value,
      borderColor:
        onPressBorderColor !== null
          ? interpolateColor(anim.value, [0, 1], [resolvedBorderColor, pressBorderColor])
          : undefined,
      overflow: "hidden",
      transform:
        onPressAnimatedScale != null
          ? [
              {
                scale: interpolate(anim.value, [0, 1], [1, onPressAnimatedScale]),
              },
            ]
          : undefined,
    };
  }, [
    anim.value,
    animatedBackgroundColor.value,
    onPressAnimatedScale,
    onPressBorderColor,
    pressBorderColor,
    resolvedBorderColor,
  ]);

  const pressableStyle = useCallback(
    (state: PressableStateCallbackType) => {
      return [{ flex: 1 }, paddingValues, typeof style === "function" ? style(state) : style];
    },
    [paddingValues, style]
  );

  const _LoadingComponent = LoadingComponent ?? (
    <ActivityIndicator
      color={combinedProps.textColor ? resolveThemeColor(combinedProps.textColor) : undefined}
    />
  );

  return (
    <ButtonContext.Provider value={combinedProps}>
      <Animated.View style={[animatedStyle, tokens]}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          android_ripple={{
            color: pressColor === "transparent" ? undefined : pressColor,
          }}
          onPress={onPress}
          disabled={isLoading ?? disabled}
          style={pressableStyle}
          {...rest}
        >
          <Row space={space} alignVertical={alignVertical} alignHorizontal={alignHorizontal} flex={1}>
            {isLoading ? _LoadingComponent : children}
          </Row>
        </Pressable>
      </Animated.View>
    </ButtonContext.Provider>
  );
}

function ButtonText({ children, variant: textVariant, ...props }: Omit<TextProps, "family">) {
  const variant = useButtonContext();
  const theme = useInternalTheme();
  const variantText = textVariant ?? variant.textVariant ?? theme.defaults.Button.textVariant;
  const variantTextColor =
    variantText && theme.variants.Text[variantText].color
      ? theme.variants.Text[variantText].color
      : undefined;

  return (
    <Text textAlign="center" color={variant.textColor ?? variantTextColor} variant={variantText} {...props}>
      {children}
    </Text>
  );
}

Button.Text = ButtonText;
