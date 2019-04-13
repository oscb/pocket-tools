import * as React from 'react';
import { Delivery } from '../../models/delivery';
import styled from '@emotion/styled';;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../styles/button';
import DeliveryHeader from './deliveryHeader';
import { AnimatedListItem } from '../AnimatedListItem';

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
    border-right: 1px solid rgba(255, 255, 255, 0.5);
    border-left: 1px solid rgba(0, 0, 0, 0.1);
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
    return (
      // There seems to be a bug with styling Posed components with emotion 
      // where it complains about not providing a theme property
      <Container theme>
        <DeliveryHeader {...this.props} showDetails={true} />
        {/* Show List */}
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
