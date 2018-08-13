import * as React from "react";

import "./modal.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export interface ModalProps {
  title: string;
  icon?: IconProp;
  spin?: boolean;
  iconStyle?: React.CSSProperties
}

export default class Modal extends React.Component<ModalProps, any> {
  public render() {
    // TODO: Add close modal with config
    return (
      <div className="modal">
        <h1 className="modal-name">{this.props.title}</h1>
        <div className="modal-background" />
        {this.props.icon !== undefined && 
        <div className="modal-icon" style={this.props.iconStyle}>
          <FontAwesomeIcon icon={this.props.icon} className={this.props.spin ? 'spin' : ''}/>
        </div>
        }
        <div className="modal-content">{this.props.children}</div>
      </div>
    );
  }
}
