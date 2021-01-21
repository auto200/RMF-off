import { extendTheme } from "@chakra-ui/react";
import { headerHeight, playerHeight } from "./constants";

export default extendTheme({
  styles: {
    global: {
      "#root": {
        marginTop: `${headerHeight + "px"}`,
        marginBottom: `${playerHeight + "px"}`,
      },
    },
  },
});
