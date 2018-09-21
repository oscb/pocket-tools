// import * as path from 'path';
import * as React from "react";
import { hot } from "react-hot-loader";
import { withRouter } from "react-router";
import { BrowserRouter, Redirect, Route, RouteProps } from "react-router-dom";
import "./App.scss";
import Dashboard from "./components/dashboard/dashboard";
import { Home, HomeProps, RouterHomeProps } from "./components/home/home";
import "./icons";
import { ApiHelper } from './models/apiHelper';

type PrivateRouteProps = { component: React.ComponentType<{}> } & RouteProps;

const RouterDashboard = withRouter(Dashboard);
const RouterHome = withRouter(Home);
const PrivateRoute = (props: PrivateRouteProps) => {
  const { component: Component, ...rest } = props;

  return (
    <Route
      {...rest}
      render={p => {
        if (ApiHelper.isAuthenticated) {
          return <Component {...p} />;
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
          <PrivateRoute component={RouterDashboard} />
        </div>
      </BrowserRouter>
    );
  }
}

// export default App;
export default hot(module)(App);
