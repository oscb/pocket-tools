import * as React from 'react';
import { Delivery } from '../../models/delivery';
import styled from '@emotion/styled';;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DeliveryTimeIcon from './deliveryTimeIcon';

const Header = styled('div')`
  padding: 1rem;
  display: flex;

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
    text-transform: lowercase;
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
              <h1>{this.props.relativeTime} {this.props.time} <DeliveryTimeIcon time={this.props.time} /></h1>
          }
          {!this.props.relativeTime &&
            <h1>{this.props.frequency} {this.props.time} <DeliveryTimeIcon time={this.props.time} /></h1>
          }
          <h2>{this.props.query.count} {this.props.query.countType === 'time' ? 'min' : 'articles'}, sorted by {this.props.query.orderBy}</h2>
        </TitleContainer>
        {this.props.showDetails &&
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
        }
      </Header>
    );
  }
}
