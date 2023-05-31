import { Stack, Text, ThemeProvider } from "@lightbase/rn-design-system";
import { ScrollView } from "react-native";

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
  return (
    <ScrollView contentContainerStyle={{ paddingVertical: 40 }}>
      <Stack space="12px">
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
    </ScrollView>
  );
};
