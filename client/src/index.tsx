import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import StoreContextProvider from "./contexts/StoreContext";
// import * as serviceWorker from "./serviceWorker";
import { SOCKET_URL } from "./utils/constants";
import theme from "./utils/theme";

if (!SOCKET_URL) {
  throw new Error(
    `socket url not specified in ".env.${process.env.NODE_ENV}*" file`
  );
}

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <StoreContextProvider>
        <App />
      </StoreContextProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
