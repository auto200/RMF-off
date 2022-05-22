import { extendTheme } from "@chakra-ui/react";
import { HEADER_HEIGHT, PLAYER_HEIGHT } from "./constants";

export default extendTheme({
  config: { initialColorMode: "dark", disableTransitionOnChange: false },
  styles: {
    global: {
      "#root": {
        marginTop: `${HEADER_HEIGHT + "px"}`,
        marginBottom: `${PLAYER_HEIGHT + "px"}`,
      },
    },
  },
});
