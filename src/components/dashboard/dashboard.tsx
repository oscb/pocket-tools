import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import posed, { PoseGroup } from "react-pose";
import { Route, RouteComponentProps, Switch } from "react-router";
import { Link } from "react-router-dom";
import { ApiHelper } from '../../models/apiHelper';
import { Delivery, DeliveryApi } from "../../models/delivery";
import Header from "../header/header";
import DeliveryEditor from "./deliveryEditor";
import { css } from "emotion";
import { ModalStyles } from "../../styles/modalStyles";
import UserProfile from "../user/userProfile";
import { DashboardStyles } from "../../styles/dashboardStyles";
import DeliveryItem from "./deliveryItem";
import { hot } from "react-hot-loader";
import styled from "react-emotion";
import Modal from "./modal";


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
  deliveries: Delivery[];
  status: DashboardStatus;
  showConfirmation: boolean;
}

class Dashboard extends React.Component<
  DashboardProps & RouteComponentProps<any>,
  DashboardState
> {
  private confirmationModal: JSX.Element;

  constructor(props, state) {
    super(props);

    this.loadDeliveries();

    this.state = {
      deliveries: [],
      status: DashboardStatus.loading,
      showConfirmation: false,
      ...state
    };
  }

  public render() {
    if (this.props.location.state && this.props.location.state.reload) {
      this.loadDeliveries(true);
    }
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
          <a href="#" onClick={this.logout}>
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
              <PoseGroup>
                {this.state.deliveries.map(x =>
                  <DeliveryAnimated key={x.id}>
                    <DeliveryItem 
                      {...x} 
                      editFunc={this.editDelivery} 
                      deleteFunc={this.deleteDeliveryConfirmation}
                      sendFunc={this.sendDeliveryConfirmation}
                      />
                  </DeliveryAnimated>
                )}
              </PoseGroup>
            </DashboardStyles.DeliveryList>
          }
          </PoseGroup>
          
          <DashboardStyles.Button onClick={this.addDelivery}>
            <FontAwesomeIcon icon="plus" /> Create delivery
          </DashboardStyles.Button>
        </DashboardStyles.Content>
        {/* Confirmation Modals */}
        <PoseGroup>
          {this.state.showConfirmation && this.confirmationModal}
        </PoseGroup>
        {/* Routes */}
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

  public async loadDeliveries(forceReload: boolean = false) {
    const animationTime = 2.5;
    const start = new Date().getTime();
    const deliveries = await DeliveryApi.getByUser();
    const timeToLoad = new Date().getTime() - start;

    // Animation takes 2.5s to get to the middle, so we want to stop it at the next middle point 
    // TODO: this doesn't work perfectly fine since React is not instantaneous, but I'll leave it for now.
    const progress = ((timeToLoad /1000) % (animationTime * 2));
    if (!forceReload && progress !== animationTime) {
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

  private logout = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    ApiHelper.logout();
    this.props.history.push("/");
  }

  private addDelivery = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.history.push('/delivery', { modal: true });
  }

  private editDelivery = (delivery: Delivery) => {
    this.props.history.push(`/delivery/${delivery.id}`, { modal: true });
  }

  private deleteDeliveryConfirmation = (delivery: Delivery) => {
    this.confirmationModal = ( 
      <RouteContainer key="deleteConfirm" className={css`${ModalStyles.Background}`}>
        <ModalStyles.ModalWrapper>
          <Modal 
            title=""
            icon='question'
            close={this.dismissConfirmation}
          >
            <ModalStyles.Loader>
              Are you sure you want to delete your delivery? <br/>
              (Deliveries cannot be recovered, but your articles will always be in your pocket)
            </ModalStyles.Loader>
            <ModalStyles.ButtonBar>
              <ModalStyles.Button primary={false} onClick={this.dismissConfirmation}>
                <FontAwesomeIcon icon="times" /> Cancel
              </ModalStyles.Button>
              <ModalStyles.Button onClick={this.deleteDelivery(delivery.id)}>
                Delete <FontAwesomeIcon icon="trash-alt" />
              </ModalStyles.Button>
            </ModalStyles.ButtonBar>
          </Modal>
        </ModalStyles.ModalWrapper>
      </RouteContainer>
    );
    this.setState({...this.state, showConfirmation: true});
  }

  private sendDeliveryConfirmation = (delivery: Delivery) => {
    // TODO Refactor confirmation modal into component
    this.confirmationModal = ( 
      <RouteContainer key="sendConfirm" className={css`${ModalStyles.Background}`}>
        <ModalStyles.ModalWrapper>
          <Modal 
            title=""
            icon='envelope'
            close={this.dismissConfirmation}
          >
            <ModalStyles.Loader>
              Send a delivery now?<br/>
              Delivery will still be sent on schedule.
            </ModalStyles.Loader>
            <ModalStyles.ButtonBar>
              <ModalStyles.Button primary={false} onClick={this.dismissConfirmation}>
                <FontAwesomeIcon icon="times" /> Cancel
              </ModalStyles.Button>
              <ModalStyles.Button onClick={this.sendDelivery(delivery.id)}>
                Send Now <FontAwesomeIcon icon="envelope" />
              </ModalStyles.Button>
            </ModalStyles.ButtonBar>
          </Modal>
        </ModalStyles.ModalWrapper>
      </RouteContainer>
    );
    this.setState({...this.state, showConfirmation: true});
  }

  private sendDelivery = (id: string) => {
    return () => {
      this.dismissConfirmation();
      DeliveryApi.send(id);
    }
  }

  private deleteDelivery = (id: string) => {
    return () => {
      this.dismissConfirmation();
      DeliveryApi.delete(id).then(() => {
        this.loadDeliveries(true);
      });
    }
  }

  private dismissConfirmation = () => {
    this.setState({...this.state, showConfirmation: false});
  }
}

export default hot(module)(Dashboard);
