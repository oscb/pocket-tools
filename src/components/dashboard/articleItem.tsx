import * as React from 'react';
import styled from 'react-emotion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import posed from 'react-pose';

const ArticleAnimated = posed.div({
  enter: { 
    x: 0, 
    opacity: 1,
  },
  exit: { 
    x: 200, 
    opacity: 0,
  }
});

const Container = styled(ArticleAnimated)`
  background: ${props => props.theme.bgColor};
  color: ${props => props.theme.textColor};
  width: 100%;
  max-width: 500px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 120px auto;
  grid-template-rows: auto auto;
  grid-template-areas: 
    "img title" 
    "img content";
  box-shadow: ${props => props.theme.boxShadow};
  border-radius: ${props => props.theme.borderRadius};
  margin: 1rem 0;
  min-height: 100px;
  overflow: hidden;

  p {
    margin: 0;
  }
`

const Title = styled('h1')`
  grid-area: title;
  margin: 0;
  padding: 0.5rem;
  padding-left: 0;
  font-size: 1.2rem;
  color: ${props => props.theme.mainColor};
`

const Content = styled('div')`
  grid-area: content;
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  padding-left: 0;
  align-self: end;
`

interface ImageProps {
  src: string;
}

const Image = styled('div')<ImageProps>`
  grid-area: img;
  max-width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  margin-right: 0.5rem;
  border-right: 1px solid #c1c1c1;
  background-size: cover;
  background-color: ${props => props.theme.secondaryColor};
  background-image: url('${props => props.src}');
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
`
const Link = styled('p')`
  word-wrap: break-word;
  white-space: nowrap;
  text-overflow: ellipsis;
  
  a {
    color: ${props => props.theme.textColor};
    text-decoration: none;
  }
`
const Time = styled('p')`
  text-align: right;
`
export interface ArticleItemProps {
  image: string;
  title: string;
  url: string;
  timeToRead?: number;
}

export default class ArticleItem extends React.Component<ArticleItemProps, any> {
  public render() {
    const url = new URL(this.props.url);
    const domain = url.host;
    return (
      <Container>
        <Image src={this.props.image} />
        <Title>{this.props.title}</Title>
        <Content>
          <Link>
            <a href={this.props.url}>
              <FontAwesomeIcon icon="link" /> {domain}
            </a>
          </Link>
          <Time>
            <FontAwesomeIcon icon="clock" /> {this.props.timeToRead ? `${this.props.timeToRead} min` : "N/A"}
          </Time>
        </Content>
      </Container>
    );
  }
}
