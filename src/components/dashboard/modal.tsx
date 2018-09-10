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

const ModalAnim = posed.div({
  enter: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 300,
      ease: 'backOut'
    }
  },
  exit: { 
    y: 150, 
    opacity: 0,
    transition: {
      duration: 200,
      ease: 'anticipate'
    }
  }
});

const CSSModalContent = css`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  box-sizing: border-box;
`

export default class Modal extends React.Component<ModalProps, any> {

  onShadeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    this.props.close ? this.props.close() : null;
  }

  public render() {
    // TODO: Add close modal with config
    return (
      <ModalStyles.Modal className={this.props.className}>
        {this.props.title && 
          <ModalStyles.Title>{this.props.title}</ModalStyles.Title>
        }
        <ModalAnim className={css`${CSSModalContent}`}>
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
        </ModalAnim>
      </ModalStyles.Modal>
    );
  }
}
