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
        key="loader"
        title="" 
        icon='sync'
        spin={true}
        className={css`
          width: 250px;
        `}
      >
        <ModalStyles.Message>
          <h4>{this.props.message}</h4>
        </ModalStyles.Message>
      </Modal>
    );
  }
}
