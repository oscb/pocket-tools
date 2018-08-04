import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./App";
// import App from "./Other";
import registerServiceWorker from "./registerServiceWorker";

// CSS
import "./index.scss";
import { MuiThemeProvider } from "@material-ui/core";

// Material Theme
import theme from "./Theme";

const root = document.createElement("div");
document.body.appendChild(root);

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <App />
  </MuiThemeProvider>,
  root
);
registerServiceWorker();
