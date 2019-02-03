import * as React from 'react';
import styled from 'react-emotion';
import { darken } from 'polished';
import { Elements } from 'react-stripe-elements';
import { SubscriptionAPI, SubscriptionPlan } from 'src/models/subscriptions';

export interface SubscriptionsProps {
  plans: SubscriptionPlan[];
  changeSubscription: (selection: SubscriptionPlan) => void; 
  currentSelection?: SubscriptionPlan;
}

export default class Subscriptions extends React.Component<SubscriptionsProps, null> {


  constructor(props: SubscriptionsProps) {
    super(props);
  }

  changeSelection = (selection: SubscriptionPlan) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      this.props.changeSubscription(selection);
    }
  }

  public render() {
    let plans = [];
    for (const p of this.props.plans) {
      if (p.public === true || p.overrideShow) {
        plans.push(
          <SubscriptionItem 
            key={p.name} 
            selected={this.props.currentSelection !== undefined && this.props.currentSelection.name.toLowerCase() === p.name.toLowerCase()} 
            primary={p.amount > 0 || p.overrideShow}
            special={p.overrideShow}
            onClick={this.changeSelection(p)}>
            <h1>{p.name}{p.overrideShow ? '*' : null}</h1>
            <h2>{p.overrideShow ? "* This is a special plan only visible to you! If you select a different plan you won't be able to select it back." : null}</h2>
            <p>{p.description}</p>
            {p.amount > 0 ? <h2>${p.amount}/{p.interval}</h2> : null}
          </SubscriptionItem>
        )
      }
    }

    return (
      <React.Fragment>
        <SubscriptionSelector>
          {plans}
        </SubscriptionSelector>
        {this.props.currentSelection.amount > 0 && 
          <StripeForms>
            <p>Thanks for your support! 🎉</p>
            {this.props.children}
            <p className="info">
              <i>
                Payments are processed through Stripe
              </i>
            </p>
          </StripeForms>
        }
      </React.Fragment>
    );
  }
}


const SubscriptionSelector = styled('div')`
  position: relative;
  display: grid;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-self: flex-start;
  box-sizing: border-box;
  /* width: 100%; */
`

interface SubscriptionItemProps {
  primary?: boolean;
  selected?: boolean;
  special?: boolean;
}

const SubscriptionItem = styled('div')<SubscriptionItemProps>(
  {
    textAlign: 'center',
    flexGrow: 0,
    flexShrink: 1,
    margin: '0.5rem',
    padding: '0.5rem',
    cursor: 'pointer',
    boxSizing: 'border-box',

    h1: {
      fontSize: '1.2rem',
      margin: 0,
    },

    h2: {
      fontSize: '0.7rem',
      margin: 0,
    },
  },
  (props) => ({
    background: props.theme.bgColor,
    borderRadius: props.theme.borderRadius,
    // boxShadow: props.theme.boxShadow,
    border: `4px solid ${props.theme.secondaryBg}`,
    color: props.theme.textColor,

    h1: {
      color: props.theme.mainColor,
    },
    h2: {
      // color: props.theme.secondaryColor,
    },
  }),
  (props) => ({
    // flexBasis: props.special ? '100%' : '50%',
    h1: 
    {
      color: props.primary ? 
        props.theme.mainColor : 
        props.theme.secondaryColor
    },
  }),
  (props) => {
    if (props.selected) {
      return {
        // color: props.theme.bgColor,
        // background: props.primary ? props.theme.mainColor : props.theme.secondaryColor,
        // borderColor: darken(0.05, props.primary ? props.theme.mainColor : props.theme.secondaryColor),
        borderColor: props.primary ? props.theme.mainColor : props.theme.secondaryColor,
        h1: {
          // color: props.theme.bgColor,
        },
        h2: {
          // color: props.theme.bgColor,
        }
      }
    } 
    return {};
  }
);

const StripeForms = styled('div')(
  {
    "input, .StripeElement": {
      display: 'block',
      margin: '10px 0 20px 0',
      maxWidth: '500px',
      padding: '10px 14px',
      fontSize: '2em',
      boxShadow: 'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
      border: '0',
      outline: '0',
      borderRadius: '4px',
      background: 'white',
    }
  }
);