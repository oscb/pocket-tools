import * as React from "react";

import "./modal.scss";

export interface ModalProps {
  title: string;
}

export default class Modal extends React.Component<ModalProps, any> {
  public render() {
    return (
      <div className="modal">
        <h1 className="modal-name">{this.props.title}</h1>
        <div className="modal-background" />
        <div className="modal-content">{this.props.children}</div>
      </div>
    );
  }
}
