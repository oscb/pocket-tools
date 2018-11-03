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
import { TimeOpts, UtcToLocal, WeekDays, getTimeslot, TimeslotsSize, TimeslotsIterator } from "../../time";

type TimeMap = { [timeslot: string]: [Delivery] };
type ScheduleMap = { [day: string]: TimeMap };

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

  public componentDidUpdate(prevProps: DashboardProps & RouteComponentProps<any>, prevState: DashboardState) {
    if (
      this.props.location.state !== undefined && 
      this.props.location.state.reload === true && 
      prevProps.location.state !== undefined && 
      prevProps.location.state.reload !== true ) {
      this.loadDeliveries(true);
    }
  }

  public render() {
    const isModal = this.props.location.pathname !== '/dashboard';
    const nextDelivery = this.findNextDelivery(this.state.deliveries);
    
    return (
      <div className="dashboard">
        <Header 
          logo="Pocket Tools" 
          nextDelivery={nextDelivery !== null ? nextDelivery.delivery : null}
          nextDate={nextDelivery !== null ? nextDelivery.day : undefined }
          />
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

          <DashboardStyles.SecondaryButton onClick={this.editAccount}>
            <FontAwesomeIcon icon="user" /> Manage Account
          </DashboardStyles.SecondaryButton>

          <DashboardStyles.Logout href="#" onClick={this.logout}>
            Logout
          </DashboardStyles.Logout>
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

    // Transform dates to local
    for (let delivery of deliveries) {
      let [time, day] = UtcToLocal(TimeOpts[delivery.time], delivery.days);
      delivery.time = TimeOpts[time];
      delivery.days = day;
    }

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
        deliveries: deliveries,
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

  private editAccount = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    this.props.history.push('/user', { modal: true });
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

  private findNextDelivery(deliveries: Delivery[]): { delivery: Delivery, day: string } {
    let deliveryMap: ScheduleMap = {};
    
    // Group deliveries by [day][timeslot]
    for (const delivery of deliveries) {
      let days = this.getDeliveryDays(delivery);

      for (const day of days) {
        if (! (day in days)) {
          deliveryMap[day] = {};
        }
        let dayList = deliveryMap[day];


        if (delivery.time in dayList) {
          dayList[delivery.time].push(delivery);
        } else {
          dayList[delivery.time] = [delivery];
        }
      }
    }
    // Find current timeslot, day of week and date num
    const today = new Date();
    const currentTimeslot = getTimeslot(today.getHours(), Math.floor);
    const currentDay = WeekDays[today.getDay()]; // Days in JS start with sunday
    // TODO: Handle February, where day 28 is going to be 30 for montlies
    // TODO: Not really handling monthlies for now, but basically it is the same logic, just checking 2 indexes at a time
    const currentDate = today.getDate(); 

    // If any deliveries for current timeslot
    let start: number = WeekDays[currentDay];
    let i: number = start;
    let firstRun = false;
    // For each timeslot (first iteration run from currenttimeslot but only first!)

    while (true) {
      if (WeekDays[i] in deliveryMap) {
        const dayList = deliveryMap[WeekDays[i]];
        let j = (firstRun)? currentTimeslot : 0;
        for(; j < TimeslotsSize; j++) {
          if (TimeOpts[j] in dayList) {
            return {
              delivery: dayList[TimeOpts[j]][0],
              day: WeekDays[i]
            };
          }
          j = ++j % TimeslotsSize;
        }
      }

      i = ++i % 7;
      if (i === start) {
        break;
      }
    }
    // See if there's any delivery for current day of week or date num
    // If none, increment timeslot and repeat until cycled all
    return null;
  }

  private getDeliveryDays(delivery: Delivery): string[] {
    let days: string[];
    if (delivery.days !== undefined && delivery.days.length > 0) {
      days = delivery.days;
    } else {
      days = Object.keys(WeekDays).filter(x => isNaN(Number(x)));
    }
    return days;
  }
}

export default hot(module)(Dashboard);
