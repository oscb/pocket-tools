import * as React from "react";
import { RouterProps, RouteComponentProps } from "react-router";
import Header from "../header/header";
import { Link } from "react-router-dom";
import DeliveryEditor from "./deliveryEditor";
import { ApiHelper } from '../../models/apiHelper';
import { DeliveryApi, Delivery } from "../../models/delivery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Loader from "../loader/loader";
import "./dashboard.scss";

// import { Redirect } from 'react-router-dom';

export interface DashboardProps {}

enum DashboardStatus {
  loading, 
  loaded
}

interface DashboardState {
  deliveries: Delivery[],
  status: DashboardStatus
}

export default class Dashboard extends React.Component<
  DashboardProps & RouteComponentProps<any>,
  DashboardState
> {

  constructor(props, state) {
    super(props);

    this.loadDeliveries();

    this.state = {
      deliveries: [],
      status: DashboardStatus.loading
    }
  }

  async loadDeliveries() {
    let deliveries = await DeliveryApi.getByUser();
    this.setState({
      ...this.state,
      status: DashboardStatus.loaded,
      deliveries: deliveries
    });
  }

  render() {
    return (<DeliveryEditor history={this.props.history} location={this.props.location} match={this.props.match}/>)

    // return (
    //   <div className="dashboard">
    //     <Header logo="Pocket Tools">
    //       <Link to="/dashboard">Dashboard</Link>
    //       <Link to="/user">Account</Link>
    //       <a href="#" onClick={e => this.logout(e)}>
    //         Logout
    //       </a>
    //     </Header>
    //     <div className="dashboard-content">
    //     {/* Loading */}
    //       {this.state.status === DashboardStatus.loading &&
    //         <Loader message="Loading deliveries"/>
    //       }
    //     {/* Loaded Empty */}
    //       {this.state.status === DashboardStatus.loaded && 
    //       this.state.deliveries && 
    //       <div className="empty">
    //         <p className="empty-icon"><FontAwesomeIcon icon="truck"/></p>
    //         <p>You don't have deliveries yet!</p>
    //       </div>}
    //     {/* TODO: Loaded show deliveries */}
    //       {this.props.children}
    //       <button className="add-new"><FontAwesomeIcon icon="plus-circle" /> Create delivery</button>
    //     </div>
    //   </div>
    // );
  }

  private logout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    ApiHelper.logout();
    this.props.history.push("/");
  }
}
