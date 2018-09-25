import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface DeliveryTimeIconProps {
  time: string
}

const TimeIconMapping = {
  "morning" : "coffee",
  "noon" : "sun",
  "afternoon" : "cloud",
  "evening" : "glass-martini",
  "midnight" : "moon",
}

export default class DeliveryTimeIcon extends React.PureComponent<DeliveryTimeIconProps, any> {

  public render() {
    const icon = this.props.time in TimeIconMapping ? TimeIconMapping[this.props.time] : "clock";
    return (
      <FontAwesomeIcon icon={icon} />
    );
  }
}
