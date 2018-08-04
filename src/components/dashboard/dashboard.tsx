import * as React from "react";
import { api } from "../../App";
import { RouterProps } from "react-router";
import Header from "../header/header";
import { Link } from "react-router-dom";
import DeliveryEditor from "./deliveryEditor";

// import { Redirect } from 'react-router-dom';

export interface DashboardProps {}

interface DashboardState {}

export default class Dashboard extends React.PureComponent<
  DashboardProps & RouterProps,
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

  // private getDeliveries() {
  //     //  TODO: Gets deliveries from API

  // }

  private logout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    api.logout();
    this.props.history.push("/");
  }
}
