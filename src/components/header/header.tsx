import * as React from 'react';
import Logo from '../header/logo';
import styled from '@emotion/styled';;
import DeliveryHeader from '../dashboard/deliveryHeader';
import { Delivery } from '../../models/delivery';

export interface HeaderProps {
  logo: string;
  nextDelivery?: Delivery;
  nextDate?: string; 
}

export default class Header extends React.Component<HeaderProps, null> {
  constructor(props: HeaderProps) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        <HeaderContainer>
          <LogoBox>
            <StyledLogo text={this.props.logo} />
          </LogoBox>
          
          <DeliveryBox>
            {this.props.nextDelivery && 
            <React.Fragment>
              <DeliveryHeadTitle>Your next Delivery:</DeliveryHeadTitle>
              <DeliveryHead 
                {...this.props.nextDelivery}
                relativeTime={this.props.nextDate}
                showDetails={false}
                />
            </React.Fragment>
              }
          </DeliveryBox>
        </HeaderContainer>
      </React.Fragment>
    );
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

const DeliveryBox = styled('div')`
  grid-column: 1;
  grid-row: 1 / 4;
  justify-self: start;
  margin: 0;
  padding: 1em;
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