import "./user.scss";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import Modal from "../dashboard/modal";
import { TextField } from "@material-ui/core";
import { User, UserApi } from '../../models/user';
import Loader from "../loader/loader";

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export interface UserProfileProps {
  newUser: boolean;
}

interface UrlParams {
  id: string;
}

interface UserProfileState extends User {
  isLoading: boolean;
  errors: {[field: string]: boolean}
}

export default class UserProfile extends React.Component<
  UserProfileProps & RouteComponentProps<UrlParams>,
  UserProfileState
> {
  user: string;
  newUser: boolean = false;

  constructor(
    props: UserProfileProps & RouteComponentProps<UrlParams>,
    state: UserProfileState
  ) {
    super(props);
    if (props.history.location.state) {
      this.newUser = props.history.location.state.newUser;
    }

    let router_state: Partial<UserProfileState> = this.props.history.location
      .state;
    if (router_state) {
      state = {
        ...router_state,
        ...state
      };
    }
    this.loadUserData();

    this.state = {
      isLoading: true,
      errors: {},
      ...state
    };
  }

  async loadUserData() {
    let user = await UserApi.me();
    this.setState({
      ...this.state,
      isLoading: false,
      username: user.username,
      email: user.email,
      kindle_email: user.kindle_email
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
  
  handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, 
    validate?: (string) => boolean)
  {
    let errors: {[field: string]: boolean} = {};
    if (validate !== undefined) {
      errors[event.target.name] = !validate(event.target.value);
    }

    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
      errors: {
        ...this.state.errors,
        ...errors
      }
    });
  };

  save = event => {
    event.preventDefault();
    if (!this.validateForm()) {
      // TODO: Error handling
      return;
    }
    UserApi.update(this.state as User);
  };

  checkErrors(name: string): boolean {
    return name in this.state.errors && this.state.errors[name];
  }

  render() {
    if (this.state.isLoading) {
      return (<Loader message="Loading your user data" />);
    } 
    return (
      <Modal title={this.newUser ? "Setup your account!" : "Account"}>
        <form className="user-editor">
          <TextField
            name="username"
            label="Pocket Username"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            value={this.state.username}
            margin="normal"
            disabled
          />
          <TextField
            error={this.checkErrors('email')}
            name="email"
            label="Email"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            placeholder="your_email@gmail.com"
            value={this.state.email}
            onChange={e => this.handleChange(e, this.validateEmail)}
            margin="normal"
          />
          <TextField
            error={this.checkErrors('kindle_email')}
            name="kindle_email"
            label="Kindle Email"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            placeholder="your_kindle@kindle.com"
            value={this.state.kindle_email}
            onChange={e => this.handleChange(e, this.validateKindleEmail)}
            margin="normal"
          />
          <p>
            {/* TODO: Add quick copy button to copy the email! */}
            <i>
              Remember to give access to deliveries@pockettools.xyz in to your
              approved email list in Amazon!{" "}
              <a href="https://www.amazon.com/gp/help/customer/display.html?nodeId=201974240">
                Learn more
              </a>
            </i>
          </p>
        </form>
        <button className="submit" disabled={!this.validateForm()} onClick={e => this.save(e)}>
          Save
        </button>
      </Modal>
    );
  }
}
