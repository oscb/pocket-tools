import * as React from 'react';
import styled from "@emotion/styled-base";

export interface CheckCircleProps {
  label: string;
  checked?: boolean;
  onCheck?: (prev: boolean) => void;
}

interface CircleButtonProps {
  checked?: boolean
}

const CircleButton = styled('div')<CircleButtonProps>(
  {
    border: 'none',
    borderRadius: '2em',
    height: '1em',
    width: '1em',
    margin: '0.25em',
    transition: 'all 100ms cubic-bezier(0.445, 0.05, 0.55, 0.95)',
    display: 'inline-block',
    padding: '0.5em',
    textAlign: 'center',
    verticalAlign: 'middle',
    lineHeight: '1em',
    cursor: 'pointer',
    fontSize: '16px'
  },
  (props) => ({
    color: props.checked ? props.theme.bgColor : props.theme.textColor,
    backgroundColor: props.checked ? props.theme.mainColor: props.theme.textColorSubtle
  })
);

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
      <CircleButton checked={this.props.checked} onClick={x => this.handleClick(x)}>
        {this.props.label}
      </CircleButton>
    );
  }
}
