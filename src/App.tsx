// import * as path from 'path';
import * as React from "react";
// import { hot } from "react-hot-loader";
import { Home, RouterHomeProps, HomeProps } from "./components/home/home";
import { BrowserRouter, Route, Redirect, RouteProps } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import User from "./components/user/user";
import { withRouter } from "react-router";
import "./App.scss";
import "./icons";
import { ApiHelper } from './models/apiHelper';

type PrivateRouteProps = { component: React.ComponentType<{}> } & RouteProps;

const RouterDashboard = withRouter(Dashboard);
const RouterUser = withRouter(User);
const RouterHome = withRouter(Home);
const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props;
  return (
    <Route
      {...rest}
      render={p => {
        if (ApiHelper.isAuthenticated) {
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

export default App;
// export default hot(module)(App);
