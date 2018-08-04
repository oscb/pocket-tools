// import * as path from 'path';
import * as React from "react";
import { hot } from "react-hot-loader";
// import * as agent from 'superagent';
import { Home, RouterHomeProps, HomeProps } from "./components/home/home";
// import { BrowserRouter, Route, Link, match } from 'react-router-dom';
import { BrowserRouter, Route, Redirect, RouteProps } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import User from "./components/user/user";
import { UserAPI } from "./models/interfaces";
import { withRouter } from "react-router";
import "./App.scss";

// Font Awesome Library Initialization
import fontawesome from "@fortawesome/fontawesome";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
import * as faCoffee from "@fortawesome/fontawesome-free-solid/faCoffee";
import * as faAngleDoubleDown from "@fortawesome/fontawesome-free-solid/faAngleDoubleDown";
import * as faBookmark from "@fortawesome/fontawesome-free-solid/faBookmark";
import * as faGetPocket from "@fortawesome/fontawesome-free-brands/faGetPocket";

fontawesome.library.add(faCoffee, faAngleDoubleDown, faBookmark, faGetPocket);

export const api = new UserAPI(
  localStorage.getItem("token"),
  localStorage.getItem("req_token")
);
const RouterDashboard = withRouter(Dashboard);
const RouterUser = withRouter(User);
const RouterHome = withRouter(Home);

type PrivateRouteProps = { component: React.ComponentType<{}> } & RouteProps;

const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={p => {
        if (api.isAuthenticated) {
          return <Component {...props} />;
        } else {
          return <Redirect to={{ pathname: "/" }} />;
        }
      }}
    />
  );
};

class App extends React.Component {
  render() {
    const homeProps: HomeProps = {
      logo: "Pocket Tools",
      description: "From your Pocket to your Kindle",
      heading:
        "Schedule article deliveries to your kindle with your articles saved in Pocket."
    };

    return (
      <BrowserRouter>
        <div>
          <Route
            exact={true}
            path="/"
            render={e =>
              new RouterHome({ ...homeProps, ...e } as RouterHomeProps)
            }
          />
          <PrivateRoute path="/dashboard" component={RouterDashboard} />
          <PrivateRoute path="/user/:id" component={RouterUser} />
        </div>
      </BrowserRouter>
    );
  }
}

// export default App;
export default hot(module)(App);
