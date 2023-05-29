import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { useContext } from "react";

export const useGetBottomTabBarHeight = () => {
  const bottom = useContext(BottomTabBarHeightContext);
  return bottom ?? 0;
};

export const useGetHeaderHeight = () => {
  const header = useHeaderHeight();
  return header ?? 0;
};
