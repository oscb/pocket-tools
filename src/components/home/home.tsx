import * as React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Logo from "../header/logo";
import { Footer } from "../footer/footer";
import { RouteComponentProps } from "react-router";
import KindleSVG from "../graphics/kindle";
import PhoneSVG from "../graphics/phone";
import { ApiHelper } from '../../models/apiHelper';
import { UserAPI, User } from "../../models/user";
import styled from "@emotion/styled-base";
import { keyframes } from "@emotion/core";
export interface HomeProps {
  logo: string;
  heading: string;
  description: string;
}

export type RouterHomeProps = HomeProps & RouteComponentProps<null>;

export class Home extends React.Component<RouterHomeProps> {
  private userApi = new UserAPI(ApiHelper.token);

  async handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    await ApiHelper.login();
  }

  async redirectUser() {
    let user = await ApiHelper.getUserData();
    if (
      user !== undefined && 
      user !== null)
    {
      if (
        user.email !== null && 
        user.email !== undefined && 
        user.kindle_email !== null && 
        user.kindle_email !== undefined) 
      {
        this.props.history.push("/dashboard");
      } else {
        this.props.history.push(`/user/`, {
          ...user,
          newUser: true
        });
      }
    }
  }

  render() {
    this.redirectUser();
    return (
      <StyledHome>
        <HomeHeader>
          <Logo text={this.props.logo} />

          <h2>{this.props.heading}</h2>
          <p>{this.props.description}</p>

          {/* <img src={image} /> */}
          <Graphix>
            <KindleSVG width={49} height={68} />
            <PhoneSVG />
          </Graphix>
        </HomeHeader>
        <Login href="#" onClick={e => this.handleClick(e)} className="login">
          Login in Pocket <FontAwesomeIcon icon={['fab', 'get-pocket']} />
        </Login>
        <Footer />
      </StyledHome>
    );
  }
}


const StyledHome = styled('div')`
  text-align: center;
  color: ${props => props.theme.bgColor};
  
  h2, p {
    color: ${props => props.theme.bgColor};
    position: relative;
    z-index: 20;
    text-shadow: 2px 2px 1px ${props => props.theme.secondaryColor};
  }
  
  h2 {
    position: absolute;
    bottom: 20px;
    right: 1em;
    text-align: right;
    width: 35%;
    font-size: 20px;
  }

  p {
    margin: 0.5rem 0;
  }
`

const HomeHeader = styled('div')`
  background-color: ${props => props.theme.secondaryColor};
  height: 550px;
  padding: 20px;
  border-bottom: ${props => props.theme.mainColor} 10px solid;
  position: relative;
  overflow: hidden;
`

const Login = styled('a')`
  width: 60%;
  margin: 0 auto;
  position: relative;
  top: -20px;
  font-size: 1.5em;
  padding: 1em;
  border-radius: .5rem;
  box-shadow: 0 .25rem .125rem 0 rgba(0,0,0,0.1);
  background: ${props => props.theme.mainColor};
  color: ${props => props.theme.bgColor} !important;
  border: none;
  text-decoration: none;
  z-index: 20;
`

const svgDashKeyframes = keyframes`
  0%, 15%, 100% {
    stroke-dashoffset: 100;
    opacity: 0.0;
  }

  40%, 90% {
    // stroke-dasharray: 0;
    stroke-dashoffset: 0;
    opacity: 1.0;
  }
`
const svgPushKeyframes = keyframes`
  0%, 10%, 16%, 100% {
    transform: scale(1.0);
  }

  12% {
    transform: scale(0.9);
  }

  14% {
    transform: scale(1.05);
  }
`

const Graphix = styled('div')`
  position: absolute;
  width: 0;
  margin: 0 auto;
  overflow: visible;
  height: 100%;
  top: 0;
  left: 50%;
  
  #kindle {
    transform: rotate(45deg);
    position: absolute;
    width: 300px;
    bottom: 0;
    right: -50px;
    
    @media screen and (min-width: 500px) {
      width: 400px;
      bottom: -100px;
      right: 10px;
    }
    
    #Text path {
      stroke-dasharray: 100;
      animation: ${svgDashKeyframes} 10s cubic-bezier(0.19, 0.375, 0.565, 1) infinite;
    }
  }
  
  #phone {
    transform: rotate(225deg);
    position: absolute;
    width: 150px;
    left: 75px;
    top: -10px;
    
    @media screen and (min-width: 500px) {
      width: 200px;
      left: 99px;
      top: -34px;
    }

    #Pocket path {
      transform-origin: 50% 50%;
      animation: ${svgPushKeyframes} 10s cubic-bezier(0.19, 0.375, 0.565, 1) infinite;
    }
  }
`