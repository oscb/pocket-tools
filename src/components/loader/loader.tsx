/** @jsx jsx */
import { jsx } from '@emotion/core'
import * as React from 'react';
import Modal from '../dashboard/modal';
import { ModalStyles } from '../../styles/modalStyles';
import css from '@emotion/css';

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
        css={css`
          width: 250px;
        `}
      >
        <ModalStyles.Message>
          <h6>{this.props.message}</h6>
        </ModalStyles.Message>
      </Modal>
    );
  }
}
