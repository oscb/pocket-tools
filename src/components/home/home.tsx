import "./home.scss";
import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import MtSvgLines from "react-mt-svg-lines";
import Logo from "../header/logo";
import { Footer } from "../footer/footer";
import { RouteComponentProps } from "react-router";
import KindleSVG from "../graphics/kindle";
import PhoneSVG from "../graphics/phone";
import { ApiHelper } from '../../models/apiHelper';
import { UserApi, User } from "../../models/user";
// import { Redirect } from 'react-router-dom';

// const image = require('./kindle.svg');

export interface HomeProps {
  logo: string;
  heading: string;
  description: string;
}

export type RouterHomeProps = HomeProps & RouteComponentProps<null>;

export class Home extends React.Component<RouterHomeProps> {
  async handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    await ApiHelper.login();
  }

  async componentWillMount() {
    let user: User;
    if (ApiHelper.hasCode) {
      user = await ApiHelper.authUser();
    } else {
      user = await UserApi.me();
    }
    if (
      user.email !== null && 
      user.email !== undefined && 
      user.kindle_email !== null && 
      user.kindle_email !== undefined) 
    {
      this.props.history.push("/dashboard");
    } else {
      let userId = user.id;
      this.props.history.push(`/user/${userId}`, {
        ...user,
        newUser: true
      });
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
          Login in Pocket <FontAwesomeIcon icon={['fab', 'get-pocket']} />
        </a>
        <Footer />
      </div>
    );
  }
}
