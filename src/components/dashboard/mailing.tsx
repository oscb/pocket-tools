import * as React from 'react';
import { SentArticle } from 'src/models/delivery';
import styled from '@emotion/styled-base';
import dayjs from 'dayjs';

export interface MailingProps {
  articles: SentArticle[],
  date: Date,
}

const MailingContainer = styled('div')`
  border-top: 1px solid ${props => props.theme.bgColor};
  background: ${props => props.theme.subtleBg};
  padding: 1rem;
  padding-top: 0.5rem;

  h6 {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.8rem;
  }

  ul {
    padding-left: 1rem;
  }

  li {
    list-style: circle;
    margin: 0;
    margin-bottom: 0.5rem;
  }
`

export default class MailingItem extends React.Component<MailingProps, any> {
  public render() {
    const date = dayjs(this.props.date).format('DD/MM/YYYY');
    return (
      <MailingContainer>
        <h6>Sent on {date}</h6>
        <ul>
          {this.props.articles.map(article => 
            <li key={article.pocketId}>{article.title}</li>
            )}
        </ul>
      </MailingContainer>
    );
  }
}
