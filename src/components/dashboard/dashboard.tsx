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
import DeliveryItem from "./deliveryItem";
import { hot } from "react-hot-loader";
import styled from "react-emotion";


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

const DeliveryAnimated = posed.div({
  enter: { 
    x: 0, 
    opacity: 1,
  },
  exit: { 
    x: 100, 
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

class Dashboard extends React.Component<
  DashboardProps & RouteComponentProps<any>,
  DashboardState
> {
  constructor(props, state) {
    super(props);

    this.loadDeliveries();

    this.state = {
      deliveries: [],
      status: DashboardStatus.loading,
      ...state
    };
  }

  public render() {
    const isModal = this.props.location.pathname !== '/dashboard';
    
    return (
      <div className="dashboard">
      {/* TODO: this is a hack, needs to figure out which one is actually upcomming */}
        <Header logo="Pocket Tools" delivery={this.state.deliveries ? this.state.deliveries[0] : null}>
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
          this.state.deliveries.length === 0 && 
          <DashboardStyles.Empty>
            <DashboardStyles.EmptyIcon>
              <DashboardStyles.Rumble>
                <FontAwesomeIcon icon="truck"/>
              </DashboardStyles.Rumble>
            </DashboardStyles.EmptyIcon>
            <p>You don't have deliveries yet!</p>
          </DashboardStyles.Empty>}
        {/* Loaded show deliveries */}
        <PoseGroup>
        {this.state.status === DashboardStatus.loaded && 
          this.state.deliveries.length > 0 && 
              <DashboardStyles.DeliveryList key="deliveries">
                {this.state.deliveries.map(x =>
                  <DeliveryAnimated key={x.id}>
                    <DeliveryItem 
                      {...x} 
                      editFunc={this.editDelivery} 
                      deleteFunc={this.deleteDelivery}
                      sendFunc={this.sendDelivery}
                      />
                  </DeliveryAnimated>
                )}
              </DashboardStyles.DeliveryList>
        }
        </PoseGroup>
          
          {/* TODO: Move this Click Function out */}
          <DashboardStyles.Button onClick={e => {this.props.history.push('/delivery', { modal: true })}}>
            <FontAwesomeIcon icon="plus" /> Create delivery
          </DashboardStyles.Button>
        </DashboardStyles.Content>
        <PoseGroup>
          {isModal && 
            <RouteContainer key={this.props.location.key} className={css`${ModalStyles.Background}`}>
              <Switch location={this.props.location}>
                <Route path="/delivery/:id?" key="delivery" component={DeliveryEditor}/>
                <Route path="/user" key="user" render={(props) => (
                  <UserProfile 
                    {...props}
                    newUser={this.props.location.state ? !!this.props.location.state.newUser : false} 
                    />
                  )}>
                </Route>
              </Switch>
            </RouteContainer>
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

  private editDelivery = (id: string) => {
    this.props.history.push(`/delivery/${id}`, { modal: true });
  }

  private deleteDelivery = (id: string) => {
    alert('delete');
  }

  private sendDelivery = (id: string) => {
    alert("send!");
  }
}

export default hot(module)(Dashboard);
