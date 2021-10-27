import { extendTheme } from "@chakra-ui/react";
import { HERADER_HEIGHT, PLAYER_HEIGHT } from "./constants";

export default extendTheme({
  config: { initialColorMode: "dark" },
  styles: {
    global: {
      "#root": {
        marginTop: `${HERADER_HEIGHT + "px"}`,
        marginBottom: `${PLAYER_HEIGHT + "px"}`,
      },
    },
  },
});
