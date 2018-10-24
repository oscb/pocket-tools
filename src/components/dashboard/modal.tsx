import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { ModalStyles } from "../../styles/modalStyles";
import posed, { PoseGroup } from "react-pose";
import { css } from "emotion";

export interface ModalProps {
  title?: string;
  icon?: IconProp;
  spin?: boolean;
  iconStyle?: React.CSSProperties,
  close?: () => void;
  className?: string;
}

export default class Modal extends React.Component<ModalProps, any> {

  onShadeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.close ? this.props.close() : null;
  }

  public render() {
    return (
      <ModalStyles.Modal className={this.props.className}>
        {this.props.title && 
          <ModalStyles.Title>{this.props.title}</ModalStyles.Title>
        }
        <ModalStyles.ModalBoxAnimated>
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
        </ModalStyles.ModalBoxAnimated>
      </ModalStyles.Modal>
    );
  }
}
