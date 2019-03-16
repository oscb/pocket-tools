import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { MuiThemeProvider } from "@material-ui/core";
import theme from "./styles/materialTheme";
import { ThemeProvider } from "emotion-theming";
import { Theme } from "./styles/theme";
import { Global } from "@emotion/core";
import { globalStyles } from "./styles/global";

const root = document.createElement("div");
document.body.appendChild(root);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={Theme}>
      <Global styles={globalStyles} />
      <App />
    </ThemeProvider>
  </MuiThemeProvider>,
  root
);
registerServiceWorker();
