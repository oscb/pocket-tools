import * as React from 'react';
import styled from '@emotion/styled';;
import { darken } from 'polished';
import { Elements } from 'react-stripe-elements';
import { SubscriptionAPI, SubscriptionPlan } from 'src/models/subscriptions';
import { ModalStyles } from "../../styles/modalStyles";

export interface SubscriptionsProps {
  plans: SubscriptionPlan[];
  changeSubscription: (selection: SubscriptionPlan) => void;
  originalSelection?: SubscriptionPlan;
  currentSelection?: SubscriptionPlan;
}

export interface SubscriptionsState {
  showCardInput: boolean;
}

export default class Subscriptions extends React.Component<SubscriptionsProps, SubscriptionsState> {
  constructor(props: SubscriptionsProps) {
    super(props);
    this.state = {
      showCardInput: false
    };
  }

  changeSelection = (selection: SubscriptionPlan) => {
    return (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault();
      this.props.changeSubscription(selection);
      this.setState({
        showCardInput: (selection.amount > 0 && this.props.originalSelection !== selection)
      })
    }
  }

  showCardForm = (e: React.MouseEvent) => {
    e.preventDefault(); 
    this.setState({
      showCardInput: true
    });
  }

  public render() {
    let publicPlans = [];
    let specialPlans = [];
    
    for (const p of this.props.plans) {
      if (p.public === true || p.overrideShow) {
        let plan = (
        <SubscriptionItem 
          key={p.name} 
          selected={this.props.currentSelection !== undefined && this.props.currentSelection.name.toLowerCase() === p.name.toLowerCase()} 
          primary={p.amount > 0 || p.overrideShow}
          special={p.overrideShow}
          onClick={this.changeSelection(p)}>
          <h4>{p.name}{p.overrideShow ? '*' : null}</h4>
          <h6>{p.overrideShow ? "* This is a special plan only visible to you! If you select a different plan you won't be able to select it back." : null}</h6>
          <p>{p.description}</p>
          {p.amount > 0 ? <p><b>${p.amount}/{p.interval}</b></p> : null}
        </SubscriptionItem>)

        if (p.public) {
          publicPlans.push(plan);
        } else if (p.overrideShow) {
          specialPlans.push(plan);
        }
      }
    }

    return (
      <SubscriptionsContainer>
        <SubscriptionSelector>
          {specialPlans}
        </SubscriptionSelector>
        <SubscriptionSelector>
          {publicPlans}
        </SubscriptionSelector>
        {this.props.currentSelection.amount > 0 && 
          <PaymentForm>
            <StripeForms>
              <p>Thanks for your support! 🎉</p>
              {this.state.showCardInput ? 
              (<React.Fragment>
                {this.props.children}
                <p className="info">
                  <i>
                    Payments are processed through Stripe
                  </i>
                </p>
              </React.Fragment>)
              :
              (<React.Fragment>
                <p><b>You don't need to input your card details again, unless you want to change them.</b></p>
                <a href="#" onClick={this.showCardForm}>
                  Change my payment method
                </a>
              </React.Fragment>)}
            </StripeForms>
          </PaymentForm>
        }
      </SubscriptionsContainer>
    );
  }
}

const SubscriptionsContainer = styled('div')`
  /* padding: 0.5rem; */
  margin: 1rem 0;
  /* min-height: 200px; */
`

const PaymentForm = styled('div')`
  margin: 1rem 0;
`

const SubscriptionSelector = styled('div')`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-self: flex-start;
  box-sizing: border-box;
  width: 100%;
`

interface SubscriptionItemProps {
  primary?: boolean;
  selected?: boolean;
  special?: boolean;
}

const SubscriptionItem = styled('div')<SubscriptionItemProps>(
  {
    textAlign: 'center',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '50%',
    margin: '0.5rem',
    padding: '0.5rem',
    cursor: 'pointer',
    boxSizing: 'border-box',

    p: {
      marginBottom: 0,
    },

    h4: {
      marginTop: 0,
    }
  },
  (props) => ({
    background: props.theme.bgColor,
    borderRadius: props.theme.borderRadius,
    // boxShadow: props.theme.boxShadow,
    border: `4px solid ${props.theme.secondaryBg}`,
    color: props.theme.textColor,

    h4: {
      color: props.theme.mainColor,
    },
    h6: {
      // color: props.theme.secondaryColor,
    },
  }),
  (props) => ({
    // flexBasis: props.special ? '100%' : '50%',
    h4: 
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