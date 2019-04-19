import * as React from 'react';
import { Delivery, Mailing } from '../../models/delivery';
import styled from '@emotion/styled';;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../styles/button';
import DeliveryHeader from './deliveryHeader';
import { AnimatedListItem } from '../AnimatedListItem';
import MailingItem from './mailing';

const Container = styled(AnimatedListItem)`
  width: 350px;
  margin: 1rem;
  overflow: hidden;
  background: ${props => props.theme.bgColor};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
`

const ActionBar = styled('div')`
  display: flex;

  button {
    ${props => Button({ color: props.theme.secondaryColor })}
    flex: 1 1 auto;
    font-size: 1.2rem;
    color: ${props => props.theme.bgColor};
    padding: 0.5rem;
    text-align: center;
  }
`

export interface DeliveryItemProps {
  editFunc: (delivery: Delivery) => void;
  deleteFunc: (delivery: Delivery) => void;
  sendFunc: (delivery: Delivery) => void;
}

export default class DeliveryItem extends React.Component<Delivery & DeliveryItemProps, any> {

  private wrappedEdit = this.generateButtonCallback(this.props.editFunc);
  private wrappedSend = this.generateButtonCallback(this.props.sendFunc);
  private wrappedDelete = this.generateButtonCallback(this.props.deleteFunc);

  public render() {
    let lastDelivery : Mailing;
    if (!!this.props.mailings && this.props.mailings.length > 0) {
      lastDelivery = this.props.mailings[this.props.mailings.length-1];
    }

    return (
      // There seems to be a bug with styling Posed components with emotion 
      // where it complains about not providing a theme property
      // Note! It has to be set as null or it won't read the theme from context!
      <Container theme={null}>
        <DeliveryHeader {...this.props} showDetails={true} />
        {lastDelivery !== undefined && <MailingItem articles={lastDelivery.articles} date={lastDelivery.datetime} />}
        <ActionBar>
          <button onClick={this.wrappedEdit}>
            <FontAwesomeIcon icon="edit" />
          </button>
          <button onClick={this.wrappedSend}>
            <FontAwesomeIcon icon="envelope" />
          </button>
          <button onClick={this.wrappedDelete}>
            <FontAwesomeIcon icon="trash-alt" />
          </button>
        </ActionBar>
      </Container>
    );
  }

  private generateButtonCallback(func: (delivery: Delivery) => void) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      func(this.props);
    }
  }
}
