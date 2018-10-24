import "./checkCircle.scss";
import * as React from 'react';

export interface CheckCircleProps {
  label: string;
  checked?: boolean;
  onCheck?: (prev: boolean) => void;
}

export default class CheckCircle extends React.Component<CheckCircleProps> {
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
    if (this.props.onCheck) {
      this.props.onCheck(this.props.checked);
    }
  }

  render() {
    return (
      <div className={ `checkcircle ${this.props.checked ? " enabled" : ""}`} onClick={x => this.handleClick(x)}>
        <span>{this.props.label}</span>
      </div>
    );
  }
}
