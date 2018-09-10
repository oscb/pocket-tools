import { css } from 'emotion';
import { darken, desaturate, lighten } from 'polished';

export const Button = props => css`
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