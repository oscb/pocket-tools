import * as React from "react";
import { RouteComponentProps } from "react-router";
import { api } from "../../App";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

export interface UserProfileProps {}

interface UrlParams {
  id: string;
}

export default class UserProfile extends React.Component<
  UserProfileProps & RouteComponentProps<UrlParams>,
  any
> {
  user: string;

  constructor(
    props: UserProfileProps & RouteComponentProps<UrlParams>,
    state: any
  ) {
    super(props);
    this.props = props;
    this.state = state;
  }

  render() {
    return (
      <div>
        <h3>ID: {this.props.match.params.id}</h3>
      </div>
    );
  }
}
