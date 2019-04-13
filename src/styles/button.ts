/** @jsx jsx */
import { jsx } from '@emotion/core'
import { darken, desaturate, lighten } from 'polished';
import css from '@emotion/css';

export const Button = props => css`
  margin: 0;
  border: none;
  background: ${props.color};

  &:hover {
    background: ${lighten(0.05, props.color)};
  }

  &:active {
    background: ${darken(0.05, props.color)};
  }

  &:disabled {
    background: ${desaturate(0.95, props.color)};
  }

  &:focus {
    outline: none;
  }
`