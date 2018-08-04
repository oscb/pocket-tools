import * as React from "react";
import FontAwesomeIcon from "@fortawesome/react-fontawesome";
// import * as fetch from 'isomorphic-fetch';
// import * as agent from 'superagent';
// import * as pocket from 'node-pocket';
// import { Login } from '../login/login';
import MtSvgLines from "react-mt-svg-lines";
import Logo from "../header/logo";
import { Footer } from "../footer/footer";
import "./home.scss";
import { api } from "../../App";
import { RouteComponentProps } from "react-router";
import KindleSVG from "../graphics/kindle";
import PhoneSVG from "../graphics/phone";
// import { Redirect } from 'react-router-dom';

// const image = require('./kindle.svg');

export interface HomeProps {
  logo: string;
  heading: string;
  description: string;
}

export type RouterHomeProps = HomeProps & RouteComponentProps<null>;

export class Home extends React.Component<RouterHomeProps> {
  handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    api.login();
    // api.get_token();
  }

  async componentWillMount() {
    if (api.isAuthenticated) {
      this.props.history.push("/dashboard");
    } else if (api.hasReqToken) {
      let res = await api.get_token();
      if (res.hasUserProfile) {
        this.props.history.push("/dashboard");
      } else {
        let userId = res.user._id;
        this.props.history.push(`/user/${userId}`, {
          ...res.user,
          newUser: true
        });
      }
    }
  }

  render() {
    return (
      <div className="home">
        <div className="home-header">
          <Logo text={this.props.logo} />

          <h2>{this.props.heading}</h2>
          <p>{this.props.description}</p>

          {/* <img src={image} /> */}
          <div className="graphix">
            <KindleSVG width={49} height={68} />
            <PhoneSVG />
          </div>
        </div>
        <a href="#" onClick={e => this.handleClick(e)} className="login">
          Login in Pocket <FontAwesomeIcon icon="getPocket" />
        </a>
        <Footer />
      </div>
    );
  }
}
