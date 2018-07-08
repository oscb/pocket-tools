import * as React from 'react';

import "./checkCircle.scss";

export interface CheckCircleProps {
  label: string,
  checked?: boolean
}

export interface CheckCircleState {
  checked: boolean
}

export default class CheckCircle extends React.Component<CheckCircleProps, CheckCircleState> {
  public static defaultProps: Partial<CheckCircleProps> = {
    checked: false
  };

  constructor(props: CheckCircleProps) {
    super(props);

    this.state = {
      checked: this.props.checked
    }
  }

  handleClick(x: React.MouseEvent<HTMLDivElement>) {
    x.preventDefault();
    this.setState(state => { return { checked: !state.checked } });
    // TODO: Bubble up!
  }

  render() {
    return (
      <div className={ `checkcircle ${this.state.checked ? " enabled" : ""}`} onClick={x => this.handleClick(x)}>
        <span>{this.props.label}</span>
      </div>
    );
  }
}
