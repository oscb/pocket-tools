// import * as path from 'path';
import * as React from "react";
import { hot } from "react-hot-loader";
import { withRouter, Switch } from "react-router";
import { BrowserRouter, Redirect, Route, RouteProps } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import { Home, HomeProps, RouterHomeProps } from "./components/home/home";
import "./icons";
import { ApiHelper } from './models/apiHelper';
import {Elements, StripeProvider} from 'react-stripe-elements';
import styled from "@emotion/styled-base";
import { darken } from "polished";

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

const AppStyles = styled('div')`
  font-family: ${props => props.theme.bodyFont};

  h1, h2, h3, h4, h5, h6 {
    font-family: ${props => props.theme.titleFont};
  }

  a {
    color: ${props => props.theme.secondaryColor};

    &:hover {
      color: ${props => darken(0.05, props.theme.secondaryColor)}
    }
  }
`

class App extends React.Component {
  render() {
    const homeProps: HomeProps = {
      logo: "Pocket Tools",
      description: "From your Pocket to your Kindle",
      heading:
        "Deliver your articles saved in Pocket to your kindle on a schedule!"
    };

    return (
      <AppStyles>
        <BrowserRouter>
          <StripeProvider apiKey={process.env.STRIPE_KEY}>
            <Switch>
              <Route
                exact={true}
                path="/"
                render={e =>
                  new RouterHome({ ...homeProps, ...e } as RouterHomeProps)
                }
                />
              <PrivateRoute component={RouterDashboard} />
            </Switch>
          </StripeProvider>
        </BrowserRouter>
      </AppStyles>
    );
  }
}

// export default App;
export default hot(module)(App);
