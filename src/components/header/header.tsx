import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Logo from '../header/logo';
import './header.scss';
import styled from 'react-emotion';
import DeliveryHeader from '../dashboard/deliveryHeader';
import { Delivery } from '../../models/delivery';

export interface HeaderProps {
  logo: string;
  delivery?: Delivery;
}

interface HeaderState {
  isNavOpen: boolean;
}

export default class Header extends React.Component<HeaderProps, HeaderState> {
  constructor(props: HeaderProps, state: HeaderState) {
    super(props, state);
    this.state = {
      isNavOpen: false 
    };
  }

  render() {
    let nav = null;
    if (this.state.isNavOpen) {
      const children = React.Children.map(
        this.props.children,
        (child) => {
          return <li>{child}</li>;
        }
      );
      nav = (
        <nav>
          <ul>
            {children}
          </ul> 
        </nav>
      );
    }

    return (
      <React.Fragment>
        <HeaderContainer>
          <LogoBox>
            <StyledLogo text={this.props.logo} />
          </LogoBox>
          <NavBox>
            <NavToggle href="#" onClick={(e) => this.toggleNav(e)}>
              Menu <FontAwesomeIcon icon="angle-double-down" />
            </NavToggle>
          </NavBox>
          <DeliveryBox>
            {this.props.delivery && 
            <React.Fragment>
              <DeliveryHeadTitle>Your next Delivery:</DeliveryHeadTitle>
              <DeliveryHead 
                {...this.props.delivery}
                showDetails={false}
                />
            </React.Fragment>
              }
          </DeliveryBox>
        </HeaderContainer>
        {nav}
      </React.Fragment>
    );
  }

  private toggleNav(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    this.setState((state: HeaderState) => {
      return {
        ...state, 
        isNavOpen: !state.isNavOpen
      };
    });
  }
}


const HeaderContainer = styled('header')`
  background: ${props => props.theme.secondaryColor};
  display: grid;
  grid-template-columns: auto 120px;
  grid-template-rows: 40px auto 40px;
  width: 100%;
  min-height: 100px;
`

const LogoBox = styled('div')`
  grid-column: 2;
  grid-row: 1;
  justify-self: end;
  margin: 0;
`

const NavBox = styled('div')`
  grid-column: 2;
  grid-row: 3;
  margin: 0;
  align-self: end;
  /* justify-self: right; */
`

const DeliveryBox = styled('div')`
  grid-column: 1;
  grid-row: 1 / 4;
  justify-self: start;
  margin: 0;
  padding: 1em;
`

const NavToggle = styled('a')`
  display: block;
  z-index: 100;
  color: rgba(1, 1, 1, 0.4);
  text-align: center;
  font-size: 1em;
  padding: 0 0.2em;
  text-decoration: none;
  vertical-align: middle;

  &:hover {
    background-color: $color1;
  }

  span {
    font-size: 1.5em;
    vertical-align: middle;
  }
`

const DeliveryHead = styled(DeliveryHeader)`
  margin: 0;
  padding: 0;
  line-height: 1rem;

  h1 {
    margin-top: 0.25rem;
    color: ${props => props.theme.bgColor};
  }
  
  h2 {
    margin-bottom: 0.25rem;
    color: ${props => props.theme.contrastColor};
  }
`

const DeliveryHeadTitle = styled('h3')`
  margin: 0;
  color: ${props => props.theme.contrastColor};
  font-size: 13px;
  font-weight: normal;
  font-family: ${props => props.theme.bodyFont};
  line-height: 1rem;
`

const StyledLogo = styled(Logo)`
  font-size: 9px;
  margin: 2em;
`