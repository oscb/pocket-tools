import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './loader.scss';

export interface LoaderProps {
  message: string;
}

export default class Loader extends React.Component<LoaderProps, any> {
  public render() {
    return (
      <div className="loader">
        <div className="loader-background" />
        <div className="loader-content">
          <div className="loader-icon">
            <FontAwesomeIcon icon='sync' className="spin"/>
          </div>
          <div className="loader-message">
            <h1>{this.props.message}</h1>
          </div>
        </div>
      </div>
    );
  }
}
