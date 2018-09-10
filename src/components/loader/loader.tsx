import * as React from 'react';
import Modal from '../dashboard/modal';
import { ModalStyles } from '../../styles/modalStyles';
import { css } from 'emotion';

export interface LoaderProps {
  message: string;
}

export default class Loader extends React.Component<LoaderProps, any> {
  public render() {
    return (
      <Modal
        title="" 
        icon='sync'
        spin={true}
        className={css`
          width: 50%;
        `}
      >
        <ModalStyles.Loader>
          {this.props.message}
        </ModalStyles.Loader>
      </Modal>
    );
  }
}
