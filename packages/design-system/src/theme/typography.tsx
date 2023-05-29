import { precomputeValues } from "@capsizecss/core";
import { PixelRatio, TextStyle } from "react-native";
import { FontMetric, FontWeights } from "../types";

const capsize = (options: Parameters<typeof precomputeValues>[0]) => {
  const values = precomputeValues(options);
  const fontSize = parseFloat(values.fontSize);
  const baselineTrimEm = parseFloat(values.baselineTrim);
  const capHeightTrimEm = parseFloat(values.capHeightTrim);
  const fontScale = PixelRatio.getFontScale();

  return {
    fontSize,
    lineHeight: values.lineHeight !== "normal" ? parseFloat(values.lineHeight) : undefined,
    marginBottom: baselineTrimEm * fontSize * fontScale,
    marginTop: capHeightTrimEm * fontSize * fontScale,
  } as const;
};

type CreateTextSizeProps = {
  fontMetrics: FontMetric | null;
  fontSize: number;
  lineHeight: number | undefined;
};
export const createTextSize = ({ fontMetrics, fontSize, lineHeight: leading }: CreateTextSizeProps) => {
  if (!fontMetrics) {
    return { fontSize, lineHeight: leading };
  }
  const sizes = capsize({ fontMetrics, fontSize, leading });

  return {
    ...sizes,
    marginTop: PixelRatio.roundToNearestPixel(sizes.marginTop),
    marginBottom: PixelRatio.roundToNearestPixel(sizes.marginBottom),
  } as const;
};

export const weights: { [T in FontWeights]: TextStyle["fontWeight"] } = {
  thin: "100",
  extraLight: "200",
  light: "300",
  regular: "400",
  medium: "500",
  semiBold: "600",
  bold: "700",
  extraBold: "800",
  black: "900",
};

export function getTextDecoration({
  underline,
  strikeThrough,
}: {
  strikeThrough?: boolean;
  underline?: boolean;
}) {
  let textDecorationLine = "none" as TextStyle["textDecorationLine"];
  if (underline && strikeThrough) {
    textDecorationLine = "underline line-through";
  } else if (underline) {
    textDecorationLine = "underline";
  } else if (strikeThrough) {
    textDecorationLine = "line-through";
  }
  return textDecorationLine;
}
