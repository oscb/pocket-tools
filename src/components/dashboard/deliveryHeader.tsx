import * as React from 'react';
import { Delivery } from '../../models/delivery';
import styled from '@emotion/styled';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeliveryTimeIcon from './deliveryTimeIcon';
import { CountType } from './deliveryEditor';

const Header = styled('div')`
  padding: 1rem;
  display: flex;

  h5,
  h6 {
    margin: 0.25rem 0;
  }

  h6 {
    color: ${props => props.theme.textColorSubtle};
    /* font-size: 16px; */
    font-weight: normal;
    font-family: ${props => props.theme.bodyFont};
    text-transform: lowercase;
  }

  h5 {
    color: ${props => props.theme.textColor};
    /* font-size: 18px; */
    text-transform: capitalize;
  }

  span {
    margin-right: 1rem;
  }
`

const QueryInfo = styled('div')`
  flex: 0 0 125px;
  font-size: 0.7rem;
  color: ${props => props.theme.textColorSubtle};

  p {
    margin: 0.25rem 0;
  }
`

const TitleContainer = styled('div')`
  flex: 1 0 auto;
`

export interface DeliveryHeaderProps {
  showDetails: boolean;
  className?: string;
  relativeTime?: string;
}

export default class DeliveryHeader extends React.Component<Delivery & DeliveryHeaderProps, any> {
  public render() {
    return (
      <Header className={this.props.className}>
        <TitleContainer>
          {this.props.relativeTime && 
              <h5>{this.props.relativeTime} {this.props.time} <DeliveryTimeIcon time={this.props.time} /></h5>
          }
          {!this.props.relativeTime &&
            <h5>{this.props.frequency} {this.props.time} <DeliveryTimeIcon time={this.props.time} /></h5>
          }
          <h6>{this.props.query.count} {this.props.query.countType === CountType[CountType.Time] ? 'min' : 'articles'}, sorted by {this.props.query.orderBy}</h6>
        </TitleContainer>
        {this.props.showDetails &&
          <QueryInfo>
            {this.props.query.includedTags && this.props.query.includedTags.length > 0 && 
              <p>
                <FontAwesomeIcon icon="tag" /> {this.props.query.includedTags.join(', ')}
              </p> }
            {this.props.query.excludedTags && this.props.query.excludedTags.length > 0 && 
              <p>
                <FontAwesomeIcon icon="ban" /> {this.props.query.excludedTags.join(', ')}
              </p> }
            {this.props.query.domain && 
              <p>
                <FontAwesomeIcon icon="map-marker-alt" /> {this.props.query.domain}
              </p> }
            {this.props.query.longformOnly && 
              <p>
                <FontAwesomeIcon icon="newspaper" /> Longform only
              </p> }
            {this.props.active === false && 
              <p>
                <FontAwesomeIcon icon="exclamation-triangle" /> Disabled
              </p> }
          </QueryInfo>
        }
      </Header>
    );
  }
}
