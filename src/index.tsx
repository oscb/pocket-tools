import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

// CSS
import "./index.scss";
import { MuiThemeProvider } from "@material-ui/core";

// Material Theme
import theme from "./styles/materialTheme";
import { ThemeProvider } from "emotion-theming";
import { Theme } from "./styles/theme";

const root = document.createElement("div");
document.body.appendChild(root);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <ThemeProvider theme={Theme}>
      <App />
    </ThemeProvider>
  </MuiThemeProvider>,
  root
);
registerServiceWorker();
