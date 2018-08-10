import * as React from "react";
import { RouterProps, RouteComponentProps } from "react-router";
import Header from "../header/header";
import { Link } from "react-router-dom";
import DeliveryEditor from "./deliveryEditor";
import { ApiHelper } from '../../models/apiHelper';

// import { Redirect } from 'react-router-dom';

export interface DashboardProps {}

interface DashboardState {}

export default class Dashboard extends React.Component<
  DashboardProps & RouteComponentProps<any>,
  DashboardState
> {
  render() {
    return (
      <div className="dashboard">
        <Header logo="Pocket Tools">
          <Link to="/dashboard">Dashboard</Link>
          <a href="#" onClick={e => this.logout(e)}>
            Logout
          </a>
        </Header>
        <DeliveryEditor />
        {this.props.children}
      </div>
    );
  }

  private logout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    ApiHelper.logout();
    this.props.history.push("/");
  }
}
