import * as React from "react";
import {CardElement, injectStripe, ReactStripeElements} from 'react-stripe-elements';

export interface CheckoutFormProps {
}

export class CheckoutForm extends React.PureComponent<CheckoutFormProps & ReactStripeElements.InjectedStripeProps, any> {
  public submit = async () => {
    const {token} = await this.props.stripe.createToken({name: 'Name'});
    const response = await fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "text/plain"},
      body: token.id
    });
    if (response.ok) {
      console.log("Purchase Complete!");
    }
  }

  public render() {
    return (
      <div className="checkout">
        <CardElement />
      </div>
    );
  }
}

export const StripeCheckoutForm = injectStripe(CheckoutForm);
