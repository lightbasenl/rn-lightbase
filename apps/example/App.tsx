import { Box, Row, ScrollViewBox, Stack, Text, ThemeProvider, BoxProps } from "@lightbase/rn-design-system";
import { useRef } from "react";
import { ScrollView } from "react-native/types";

import { theme } from "./theme.config";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <Main />
    </ThemeProvider>
  );
}

const fonts = [
  "thin",
  "extraLight",
  "light",
  "regular",
  "medium",
  "semiBold",
  "bold",
  "extraBold",
  "black",
] as const;

export const Main = () => {
  const ref = useRef<ScrollView>(null);

  return (
    <ScrollViewBox ref={ref} padding="12px">
      <Stack space="20px" separator={<Box height={1} backgroundColor="primary" width="100%" />}>
        <Row space="12px" wrap>
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
        </Row>

        <Row space="12px">
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
          <Box backgroundColor="primary" width={100} height={30} />
        </Row>
        <Stack space="5px">
          {fonts.map((item) => (
            <Text key={item} weight={item} size="28px" family="Exo">
              Hello
            </Text>
          ))}
        </Stack>

        <Stack space="5px">
          {fonts.map((item) => (
            <Text key={item} weight={item} size="28px" family="Kenteken">
              Hello
            </Text>
          ))}
        </Stack>
        <Stack space="5px">
          {fonts.map((item) => (
            <Text key={item} weight={item} size="28px" family="Inter">
              Hello
            </Text>
          ))}
        </Stack>
        <Stack space="5px">
          {fonts.map((item) => (
            <Text key={item} weight={item} size="28px" family="Lato">
              Hello
            </Text>
          ))}
        </Stack>
        <Stack space="5px">
          {fonts.map((item) => (
            <Text key={item} weight={item} size="28px" family="Montserrat">
              Hello
            </Text>
          ))}
        </Stack>
        <Stack space="5px">
          {fonts.map((item) => (
            <Text key={item} weight={item} size="28px" family="Neutra Text">
              Hello
            </Text>
          ))}
        </Stack>
        <Stack space="5px">
          {fonts.map((item) => (
            <Text key={item} weight={item} size="28px" family="Open Sans">
              Hello
            </Text>
          ))}
        </Stack>
      </Stack>
    </ScrollViewBox>
  );
};

type Props = {
  onSubtract: () => void;
  onAdd: () => void;
  quantity: number;
  maxQuantity?: number;
};
export function Counter({ onAdd, onSubtract, quantity, maxQuantity = Infinity, ...rest }: Props & BoxProps) {
  return <Box backgroundColor="primary" padding="20px" borderRadius="4px" {...rest} />;
}
