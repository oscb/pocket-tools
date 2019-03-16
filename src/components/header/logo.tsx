import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import styled from '@emotion/styled';;

export interface LogoProps {
  text: string;
  className?: string;
}

export default class Logo extends React.Component<LogoProps> {
  render() {
    var title;
    let splittedText = this.props.text.split(/\s+/);
    if (splittedText.length === 2) {
      title = (
        <h1>
          {splittedText[0]} <br/>  {splittedText[1]}      
        </h1>
      );
    } else {
      title = (
        <h1>
          {this.props.text}
        </h1>
      );
    }

    return (
      <LogoContainer className={this.props.className}>
        <InnerFlex>
          <FontAwesomeIcon icon="bookmark" />
          {title}
        </InnerFlex>
      </LogoContainer>
    );
  }
}

const LogoContainer = styled('div')`
  display: inline-block;
  text-align: left;
  font-size: 12px;
  color: ${props => props.theme.bgColor};

  svg {
    display: inline-block;
    vertical-align: top;
    width: 1em;
    margin: 0 0.1em;
    padding: 0;
    font-size: 2em;
    line-height: 1em;
    color: ${props => props.theme.mainColor};
    fill: ${props => props.theme.mainColor};;
    text-align: right;
  }

  h1 {
    display: inline-block;
    vertical-align: top;
    margin: 0;
    padding: 0;
    max-width: 4em;
    font-size: 2em;
    line-height: 1em;
    text-align: left;
    color: ${props => props.theme.bgColor};
  }
`

const InnerFlex = styled('div')`
  margin: 0;
  display: inline-block;
`
