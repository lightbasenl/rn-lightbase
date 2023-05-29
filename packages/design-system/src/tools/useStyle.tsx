import { DependencyList, useMemo } from "react";
import { StyleProp, ViewStyle } from "react-native";

export type RemoveStyle<T> = Omit<T, "style">;

export const useStyle = <TStyle extends ViewStyle, T extends StyleProp<TStyle>>(
  styleFactory: () => T,
  deps?: DependencyList
): T =>
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMemo(styleFactory, deps);
