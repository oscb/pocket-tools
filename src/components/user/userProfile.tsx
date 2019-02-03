import * as React from "react";
import { RouteComponentProps, Redirect } from "react-router";
import Modal from "../dashboard/modal";
import { TextField } from "@material-ui/core";
import { User, UserAPI } from '../../models/user';
import Loader from "../loader/loader";
import * as _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalStyles } from "../../styles/modalStyles";
import { css } from "emotion";
import posed, { PoseGroup } from "react-pose";
import { ApiHelper } from "../../models/apiHelper";
import Subscriptions from "./subscriptions";
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements';
import { timingSafeEqual } from "crypto";
import { SubscriptionAPI, SubscriptionPlan } from "../../models/subscriptions";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface UserProfileProps {
  newUser: boolean;
}

enum FormStatus {
  Preloading,
  Loading,
  Enabled,
  Saving,
  Saved
}

interface UserProfileState extends User {
  formStatus: FormStatus,
  // TODO: Mix these 2 togheter
  errors: {[field: string]: boolean};
  saveError?: string;
  selectedPlan?: SubscriptionPlan;
  plans: SubscriptionPlan[]
}

class UserProfile extends React.Component<
  UserProfileProps & RouteComponentProps<any> & ReactStripeElements.InjectedStripeProps,
  UserProfileState
> {
  private minWaitTime: number = 500;
  private timeout: NodeJS.Timer;
  private userApi = new UserAPI(ApiHelper.token);
  private subscriptionApi = new SubscriptionAPI(ApiHelper.token);

  constructor(
    props: UserProfileProps & RouteComponentProps<any>,
    state: UserProfileState
  ) {
    super(props);

    let router_state: Partial<UserProfileState> = this.props.history.location
      .state;
    if (router_state) {
      state = {
        ...router_state,
        ...state
      };
    }
    this.loadUserData();

    this.timeout = setTimeout(
      () => {
        this.setState({
          ...this.state,
          formStatus: FormStatus.Loading
        });
      },
      this.minWaitTime
    );

    this.state = {
      formStatus: FormStatus.Preloading,
      errors: {},
      plans: [],
      ...state
    };
  }

  async loadUserData() {
    let user = await this.userApi.me();
    const plans = await this.subscriptionApi.get();
    // Make the current selected plan public
    for (let i of plans) {
      if (i.public === false && i.name.toLowerCase() === user.subscription.toLowerCase()) {
        i.overrideShow = true;
        break;
      }
    }

    clearTimeout(this.timeout);
    this.setState({
      ...this.state,
      formStatus: FormStatus.Enabled,
      id: user.id,
      username: user.username,
      email: user.email,
      kindle_email: user.kindle_email,
      selectedPlan: plans.find(x => x.name.toLowerCase() === user.subscription.toLowerCase()),
      subscription: user.subscription,
      plans: plans
    });
  }

  validateEmail = (email: string): boolean => {
    return emailRegex.test(email.toLowerCase());
  }

  validateKindleEmail = (email: string):boolean =>  {
    return this.validateEmail(email) && email.toLowerCase().endsWith('@kindle.com');
  }

  validateForm(): boolean {
    return this.state.kindle_email !== undefined && 
      this.state.email !== undefined && 
      this.validateKindleEmail(this.state.kindle_email) &&
      this.validateEmail(this.state.email);
  }

  debouncedValidation = (validator: (field: string) => boolean) =>  _.debounce((key: string, value: string) => {
    let errors: {[field: string]: boolean} = {};
    errors[key] = !validator(value);

    this.setState({
      ...this.state,
      errors: {
        ...this.state.errors,
        ...errors
      }
    });
  }, 500);
  
  handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 
    validate?: ((key: string, value: string) => void) & _.Cancelable)
  {
    if(validate !== undefined) {
      validate(event.target.name, event.target.value);
    }

    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
      formStatus: this.state.formStatus !== FormStatus.Saving ? FormStatus.Enabled : this.state.formStatus
    });
  };

  changeSubscriptionMode = (selection: SubscriptionPlan) => {
    this.setState({
      ...this.state,
      selectedPlan: selection,
      subscription: selection.name
    })
  }

  save =  async (event) => {
    event.preventDefault();
    if (!this.validateForm()) {
      this.setState({
        ...this.state,
        saveError: "There was an error saving your data, verify that all fields are correct and try again.",
        errors: {
          ...this.state.errors,
          'save': true
        }
      });
      return;
    }
    this.setState({
      ...this.state,
      formStatus: FormStatus.Saving,
    });

    let { 
      // Only these fields are editable
      id, 
      kindle_email, 
      email,
      subscription,
      ...other } = this.state;

    const userData: Partial<User> = {
      id, 
      kindle_email,
      email,
      subscription,
    };
    
    if (
      this.state.plans && 
      this.state.plans.length > 0 && 
      this.state.selectedPlan.name in this.state.plans &&
      (this.state.selectedPlan.amount > 0)) 
    {
      const {token} = await this.props.stripe.createToken({ name: this.state.username });
      userData.stripe_token = token;
    }

    this.userApi.update(userData).then(() => {
      this.setState({
        ...this.state,
        formStatus: FormStatus.Saved,
        errors: {}
      });
      setTimeout(() => {
        this.props.history.push("/dashboard");
      }, 2000);
    }).catch((e) => {
      let detail = e.response.body.error !== undefined ? e.response.body.error : '';
      this.setState({
        ...this.state,
        formStatus: FormStatus.Enabled,
        saveError: `There was an error saving your data. Status:${e.status} Message: ${e.message} ${detail}. Try again later. If you keep seeing this error send an email to support@pockettoolkit.com` ,
        errors: {
          ...this.state.errors,
          'save': true
        }
      });
    });
  };

  checkErrors(name: string): boolean {
    return name in this.state.errors && this.state.errors[name];
  }

  cancel(e?: React.MouseEvent) {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.props.history.push('/dashboard');
  }

  render() {
    return (
      <PoseGroup>
        {this.state.formStatus === FormStatus.Loading && 
        <ModalStyles.ModalWrapper key="loader">
          <Loader key="loader" message="Loading your user data" />
        </ModalStyles.ModalWrapper>
        }
        {this.state.formStatus !== FormStatus.Preloading && 
        this.state.formStatus !== FormStatus.Loading &&
        <ModalStyles.ModalWrapper key="form">
          <Modal 
            key="userForm"
            title={this.props.newUser ? "Setup your account!" : "Account"} 
            icon={this.state.formStatus === FormStatus.Saving ? 'sync' : this.state.formStatus === FormStatus.Saved ? 'check' : 'user'} 
            spin={this.state.formStatus === FormStatus.Saving}
            iconStyle={this.state.formStatus === FormStatus.Saved ? { background: 'rgba(39, 94, 132, 1)'} : {}}
            close={() => this.cancel()}
          >
            <ModalStyles.Form>
              <ModalStyles.Section>
                  <TextField
                    name="username"
                    label="Pocket Username"
                    InputLabelProps={{
                      shrink: true
                    }}
                    style={{marginTop: 0}}
                    fullWidth
                    value={this.state.username}
                    margin="normal"
                    disabled
                  />
                  <TextField
                    error={this.checkErrors('email')}
                    helperText={this.checkErrors('email') ? "Enter a valid email" : undefined}
                    name="email"
                    label="Email"
                    InputLabelProps={{
                      shrink: true
                    }}
                    disabled={this.state.formStatus === FormStatus.Saving}
                    fullWidth
                    placeholder="your_email@gmail.com"
                    value={this.state.email}
                    onChange={e => this.handleChange(e, this.debouncedValidation(this.validateEmail))}
                    margin="normal"
                  />
                  <TextField
                    error={this.checkErrors('kindle_email')}
                    helperText={this.checkErrors('kindle_email') ? "Enter a valid email ending with @kindle.com" : undefined}
                    name="kindle_email"
                    label="Kindle Email"
                    InputLabelProps={{
                      shrink: true
                    }}
                    disabled={this.state.formStatus === FormStatus.Saving}
                    fullWidth
                    placeholder="your_kindle@kindle.com"
                    value={this.state.kindle_email}
                    onChange={e => this.handleChange(e, this.debouncedValidation(this.validateKindleEmail))}
                    margin="normal"
                  />
                  <p className="info">
                    {/* TODO: Add quick copy button to copy the email! */}
                    <i>
                      Remember to give access to deliveries@pockettools.xyz in to your
                      approved email list in Amazon!{" "}
                      <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=201974240">
                        Learn more
                      </a>
                    </i>
                  </p>
                  <Subscriptions 
                    plans={this.state.plans}
                    currentSelection={this.state.selectedPlan}
                    changeSubscription={this.changeSubscriptionMode}>
                    <CardElement />
                  </Subscriptions>
                  {
                  this.checkErrors('save') &&
                  <p className="info error">
                    {this.state.saveError}
                  </p>
                  }
              </ModalStyles.Section>
              <ModalStyles.ButtonBar>
                {this.state.formStatus === FormStatus.Saving && <ModalStyles.Status>Saving...</ModalStyles.Status>}
                {this.state.formStatus === FormStatus.Saved && <ModalStyles.Status>Saved!</ModalStyles.Status>}
                {this.state.formStatus === FormStatus.Enabled && !this.props.newUser && 
                  <ModalStyles.Button primary={false} onClick={e => this.cancel(e)}>
                    <FontAwesomeIcon icon="times" /> Cancel
                  </ModalStyles.Button>
                }
                {this.state.formStatus === FormStatus.Enabled && 
                <ModalStyles.Button disabled={!this.validateForm()} onClick={e => this.save(e)}>
                  Save
                </ModalStyles.Button>
                }
              </ModalStyles.ButtonBar>
            </ModalStyles.Form>
          </Modal>
        </ModalStyles.ModalWrapper>
        } 
      </PoseGroup>
    );
  }
}

export const UserProfileForm = injectStripe(UserProfile);
