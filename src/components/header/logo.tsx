import * as React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import './logo.scss';

export interface LogoProps {
  text: string;
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
      <div className="logo">
        <div className="inner-flex">
          <FontAwesomeIcon icon="bookmark" />
          {title}
        </div>
      </div>
    );
  }
}
