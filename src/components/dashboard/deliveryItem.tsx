import * as React from 'react';
import { Delivery, DeliveryApi, Query, Article } from '../../models/delivery';
import styled from 'react-emotion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '../../styles/button';

const Container = styled('div')`
  width: 350px;
  margin: 1rem;
  overflow: hidden;
  background: ${props => props.theme.bgColor};
  border-radius: ${props => props.theme.borderRadius};
  box-shadow: ${props => props.theme.boxShadow};
`

const Header = styled('div')`
  padding: 1rem;

  h1,
  h2,
  h3 {
    margin: 0.5rem 0;
  }

  h3 {
    color: ${props => props.theme.textColorSubtle};
    font-size: 13px;
    font-weight: normal;
    font-family: ${props => props.theme.bodyFont};
  }

  h2 {
    color: ${props => props.theme.textColorSubtle};
    font-size: 16px;
    font-weight: normal;
    font-family: ${props => props.theme.bodyFont};
    text-transform: capitalize;
  }

  h1 {
    color: ${props => props.theme.textColor};
    font-size: 18px;
    text-transform: capitalize;
  }

  span {
    margin-right: 1rem;
  }
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

const QueryInfo = styled('div')`
  color: ${props => props.theme.textColorSubtle};
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;

  p {
    margin: 0.5rem 0;
  }
`

export interface DeliveryItemProps {
  editFunc: (id: string) => void;
  deleteFunc: (id: string) => void;
  sendFunc: (id: string) => void;
}

export default class DeliveryItem extends React.Component<Delivery & DeliveryItemProps, any> {

  private wrappedEdit = this.generateButtonCallback(this.props.editFunc);
  private wrappedSend = this.generateButtonCallback(this.props.sendFunc);
  private wrappedDelete = this.generateButtonCallback(this.props.deleteFunc);

  public render() {
    return (
      <Container>
        <Header>
          <h1>{this.props.frequency} {this.props.time} <FontAwesomeIcon icon="coffee" /> </h1>
          <h2>{this.props.query.count} {this.props.query.countType === 'time' ? 'min' : 'articles'}, Sorted by {this.props.query.orderBy}</h2>
          <QueryInfo>
            {this.props.query.includedTags && this.props.query.includedTags.length > 0 && 
              <p>
                <FontAwesomeIcon icon="tag" /> {this.props.query.includedTags.join(', ')}
              </p> }
            {this.props.query.excludedTags && this.props.query.excludedTags.length > 0 && 
              <p>
                <FontAwesomeIcon icon="times" /> {this.props.query.excludedTags.join(', ')}
              </p> }
            {this.props.query.domain && 
              <p>
                <FontAwesomeIcon icon="map-marker-alt" /> {this.props.query.domain}
              </p> }
            {this.props.query.longformOnly && 
              <p>
                <FontAwesomeIcon icon="newspaper" /> Longform only
              </p> }
          </QueryInfo>
        </Header>
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

  private generateButtonCallback(func: (id: string) => void) {
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      func(this.props.id);
    }
  }

}
