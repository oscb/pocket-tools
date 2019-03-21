import * as React from "react";
import styled from "@emotion/styled";

export interface CounterProps {
  count: number;
  steps: number | [number];
  units?: string;
  max?: number;
  min?: number;
  onChange: (number) => void;
}

const StyledCounter = styled('div')`
  display: flex;
  vertical-align: top;
  justify-content: center;
  text-align: center;
  align-items: center;

  span {
    flex: 0 0 auto;
    color: ${props => props.theme.textColor};
    font-size: 1rem;
    margin: 0 1rem;
  }

  button {
    flex: 0 0 2rem;
    box-sizing: border-box;
    background: ${props => props.theme.mainColor};
    color: ${props => props.theme.bgColor};
    border: none;
    border-radius: 2rem;
    height: 2rem;
    width: 2rem;
    transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
    -webkit-box-shadow: none;
    box-shadow: none;

    &:hover {
      transform: scale(1.1, 1.1);
    }

    &:active {
      transform: scale(0.8, 0.8);
    }

    &:focus {
      outline:0;
    }
  }
`

export default class Counter extends React.Component<CounterProps> {

  handleChange(e: React.MouseEvent<HTMLElement>, add: boolean) {
    e.preventDefault();
    let func: (a: number, b: number) => number = add
      ? (a, b) => a + b
      : (a, b) => a - b;
    let changeWrapper = (a, b) => {
      let result = this.limit(func(a, b));
      this.props.onChange(result);
      return result;
    };
    this.op(changeWrapper);
  }

  op(func: (a: number, b: number) => number) {
    if (typeof this.props.steps === "number") {
      func(this.props.count, this.props.steps as number)
    } else {
      let stepArray = this.props.steps as [number];
      let i = stepArray.indexOf(this.props.count);
      if (i < 0) {
        i = 0;
      } else {
        i = func(i, 1) % stepArray.length;
      }
    }
  }

  limit(x: number) {
    if (this.props.min != null) x = Math.max(this.props.min, x);
    if (this.props.max != null) x = Math.min(this.props.max, x);
    return x;
  }

  render() {
    return (
      <StyledCounter>
        <button onClick={e => this.handleChange(e, false)} type="button">-</button>
        <span>
          {this.props.count} {this.props.units}
        </span>
        <button onClick={e => this.handleChange(e, true)} type="button">+</button>
      </StyledCounter>
    );
  }
}
