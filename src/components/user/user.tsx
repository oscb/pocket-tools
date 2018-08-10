import "./user.scss";
import * as React from "react";
import { RouteComponentProps } from "react-router";
import Modal from "../dashboard/modal";
import { TextField } from "@material-ui/core";
import { User, UserApi } from '../../models/user';

export interface UserProfileProps {
  newUser: boolean;
}

interface UrlParams {
  id: string;
}

interface UserProfileState extends User {}

export default class UserProfile extends React.Component<
  UserProfileProps & RouteComponentProps<UrlParams>,
  UserProfileState
> {
  user: string;

  constructor(
    props: UserProfileProps & RouteComponentProps<UrlParams>,
    state: UserProfileState
  ) {
    super(props);
    if (props.history.location.state) {
      props.newUser = props.history.location.state.newUser;
    }

    let router_state: Partial<UserProfileState> = this.props.history.location
      .state;
    if (router_state) {
      state = {
        ...router_state,
        ...state
      };
    }

    let id = props.match.params.id;

    // this.props = props;
    this.state = state;
  }

  handleChange = event => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  save = event => {
    event.preventDefault();
    // TODO: validate email
    // TODO: validate that kindle email is an actual kindle email
    // TODO: Send json to api
    UserApi.update(this.state as User);
  };

  render() {
    return (
      <Modal title={this.props.newUser ? "Setup your account!" : "Account"}>
        <form className="user-editor">
          <TextField
            name="username"
            label="Pocket Username"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            value={this.state.username}
            onChange={e => this.handleChange(e)}
            margin="normal"
            disabled
          />
          <TextField
            name="email"
            label="Email"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            placeholder="your_email@gmail.com"
            value={this.state.email}
            onChange={e => this.handleChange(e)}
            margin="normal"
          />
          <TextField
            name="kindle_email"
            label="Kindle Email"
            InputLabelProps={{
              shrink: true
            }}
            fullWidth
            placeholder="your_kindle@kindle.com"
            value={this.state.kindle_email}
            onChange={e => this.handleChange(e)}
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
        <button className="submit" onClick={e => this.save(e)}>
          Save
        </button>
      </Modal>
    );
  }
}
