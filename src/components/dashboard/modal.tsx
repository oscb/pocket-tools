import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ModalStyles } from "../../styles/modalStyles";

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
      <ModalStyles.Modal>
        <ModalStyles.Title>{this.props.title}</ModalStyles.Title>
        <ModalStyles.Background />
        {this.props.icon !== undefined && 
        <ModalStyles.Icon spin={this.props.spin} style={this.props.iconStyle}>
          <FontAwesomeIcon icon={this.props.icon}/>
        </ModalStyles.Icon>
        }
        <ModalStyles.Content>
          {/* <ModalStyles.Close>
            <FontAwesomeIcon icon="times-circle"/>
          </ModalStyles.Close> */}
          {this.props.children}
        </ModalStyles.Content>
      </ModalStyles.Modal>
    );
  }
}
