import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Route, RouteComponentProps, Switch } from "react-router";
import { Link } from "react-router-dom";
import { ApiHelper } from '../../models/apiHelper';
import { Delivery, DeliveryApi } from "../../models/delivery";
import Header from "../header/header";
import Loader from "../loader/loader";
import DeliveryEditor from "./deliveryEditor";
import { css } from "emotion";
import { ModalStyles } from "../../styles/modalStyles";
import UserProfile from "../user/userProfile";
import { DashboardStyles } from "../../styles/dashboardStyles";


const RouteContainer = posed.div({
  enter: { 
    opacity: 1, 
    delay: 300,
    beforeChildren: true,
  },
  exit: { 
    opacity: 0,
  }
});

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
  private previousLocation: any;

  constructor(props, state) {
    super(props);

    this.loadDeliveries();

    this.state = {
      deliveries: [],
      status: DashboardStatus.loading,
      ...state
    };

    this.previousLocation = this.props.location
  }

  public componentWillUpdate(nextProps) {
    const { location } = this.props;
    if (nextProps.history.action !== "POP" && 
        (!location.state || !location.state.modal)) 
    {
      this.previousLocation = this.props.location;
    }
  }

  public render() {
    const isModal = !!(this.props.location.state &&
      this.props.location.state.modal &&
      this.previousLocation !== location
    );

    return (
      <div className="dashboard">
        <Header logo="Pocket Tools">
          <Link to={{
              pathname: '/dashboard'
          }}>
            Dashboard
          </Link>
          <Link to={{
              pathname: '/user',
              state: { modal: true }
          }}>
            Account
          </Link>
          <a href="#" onClick={e => this.logout(e)}>
            Logout
          </a>
        </Header>
        <DashboardStyles.Content>
        {/* Loading */}
          {this.state.status === DashboardStatus.loading && 
            <DashboardStyles.Empty>
              {/* TODO: Better solution for space */}
              <DashboardStyles.EmptyIcon className={css`height: 64px;`}>
                <DashboardStyles.Translate>
                  <DashboardStyles.Rumble>
                    <FontAwesomeIcon icon="truck"/>
                  </DashboardStyles.Rumble>
                </DashboardStyles.Translate>
              </DashboardStyles.EmptyIcon>
              <p>Loading your deliveries...</p>
            </DashboardStyles.Empty>
          }
        {/* Loaded Empty */}
          {this.state.status === DashboardStatus.loaded && 
          this.state.deliveries && 
          <DashboardStyles.Empty>
            <DashboardStyles.EmptyIcon>
              <DashboardStyles.Rumble>
                <FontAwesomeIcon icon="truck"/>
              </DashboardStyles.Rumble>
            </DashboardStyles.EmptyIcon>
            <p>You don't have deliveries yet!</p>
          </DashboardStyles.Empty>}
        {/* TODO: Loaded show deliveries */}
          {this.props.children}
          
          {/* TODO: Move this Click Function out */}
          <DashboardStyles.Button onClick={e => {this.props.history.push('/delivery', { modal: true })}}>
            <FontAwesomeIcon icon="plus-circle" /> Create delivery
          </DashboardStyles.Button>
        </DashboardStyles.Content>
        <PoseGroup>
          {isModal ?
            <RouteContainer key={this.props.location.key} className={css`${ModalStyles.Background}`}>
              <Switch location={this.props.location}>
                <Route path="/delivery/:id?" key="delivery">
                  <DeliveryEditor 
                  history={this.props.history} 
                  location={this.props.location} 
                  match={this.props.match}
                  />
                </Route>
                <Route path="/user" key="user">
                  <UserProfile 
                    newUser={this.props.location.state ? !!this.props.location.state.newUser : false} 
                    history={this.props.history} 
                    location={this.props.location} 
                    match={this.props.match}
                    />
                </Route>
              </Switch>
            </RouteContainer>
            :
            null
          }
        </PoseGroup>
      </div>
    );
  }

  private async loadDeliveries() {
    const animationTime = 2.5;
    const start = new Date().getTime();
    const deliveries = await DeliveryApi.getByUser();
    const timeToLoad = new Date().getTime() - start;

    // Animation takes 2.5s to get to the middle, so we want to stop it at the next middle point 
    // TODO: this doesn't work perfectly fine since React is not instantaneous, but I'll leave it for now.
    const progress = ((timeToLoad /1000) % (animationTime * 2));
    if (progress !== animationTime) {
      let next =  2.5 - progress;
      if (progress > animationTime) {
        next += 2.5;
      }
      setTimeout(
        () => {
          this.setState({
            ...this.state,
            status: DashboardStatus.loaded,
            deliveries: deliveries
          });
        },
        next * 1000 * 3
      )
    } else {
      this.setState({
        ...this.state,
        status: DashboardStatus.loaded,
        deliveries: deliveries
      });
    }
  }

  private logout(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    ApiHelper.logout();
    this.props.history.push("/");
  }
}
