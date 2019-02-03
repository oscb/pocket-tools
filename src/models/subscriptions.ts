import { authReqGenerator, publicReq } from './api';
import * as agent from "superagent";

export interface SubscriptionPlan {
  name: string;
  creditsPerMonth?: string;
  public: boolean;
  description: string;
  currency: string;
  amount: number;
  interval: string;
  overrideShow?: boolean;
}

export class SubscriptionAPI {
  private authReq: (method: string, url: string) => agent.SuperAgentRequest;

  constructor(token: string) {
    this.authReq = authReqGenerator(token);
  }

  async get(): Promise<SubscriptionPlan[]> {
    let resp = await this.authReq('GET', `/subscriptions`).send();
    return resp.body;
  }
}