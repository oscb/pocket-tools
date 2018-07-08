import * as React from "react";

import "./counter.scss";

export interface CounterProps {
  count: number;
  steps: number | [number];
  units?: string;
  max?: number;
  min?: number;
  onChange: (number) => void;
}

export interface CounterState {
  count: number;
}

export default class Counter extends React.Component<
  CounterProps,
  CounterState
> {
  constructor(props: CounterProps) {
    super(props);

    this.state = {
      count: this.props.count
    };
  }

  handleChange(e: React.MouseEvent<HTMLElement>, add: boolean) {
    e.preventDefault();
    let func: (a: number, b: number) => number = add
      ? (a, b) => a + b
      : (a, b) => a - b;
    let changeWrapper = (a, b) => {
      let result = func(a, b);
      this.props.onChange(result);
      return result;
    };
    this.op(changeWrapper);
  }

  op(func: (a: number, b: number) => number) {
    if (typeof this.props.steps === "number") {
      this.setState(state => {
        return {
          ...state,
          count: this.limit(func(state.count, this.props.steps as number))
        };
      });
    } else {
      this.setState(state => {
        let stepArray = this.props.steps as [number];
        let i = stepArray.indexOf(state.count);
        if (i < 0) {
          i = 0;
        } else {
          i = func(i, 1) % stepArray.length;
        }

        return {
          ...state,
          count: this.limit((this.props.steps as [number])[i])
        };
      });
    }
  }

  limit(x: number) {
    if (this.props.min != null) x = Math.max(this.props.min, x);
    if (this.props.max != null) x = Math.min(this.props.max, x);
    return x;
  }

  render() {
    return (
      <div className="count-number">
        <button onClick={e => this.handleChange(e, false)}>-</button>
        <span>
          {this.state.count} {this.props.units}
        </span>
        <button onClick={e => this.handleChange(e, true)}>+</button>
      </div>
    );
  }
}
