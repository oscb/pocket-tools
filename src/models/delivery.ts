import { authReqGenerator } from './api';
import * as agent from "superagent";
import { ApiHelper } from './apiHelper';

export interface Query {
  domain?: string;
  countType: string;
  count: number;
  orderBy: string;
  includedTags?: string[];
  excludedTags?: string[];
  longformOnly: boolean;
}

export interface Mailing {
  datetime: Date,
  articles: Article[]
}

export interface Article {
  pocketId: string;
  url: string;
}

export interface Delivery {
  id: string;
  user: string;
  kindle_email: string;
  active: boolean;
  query: Query;
  frequency: string;
  time: string;
  day?: string;
  mailings?: Mailing[];
}

export class DeliveryAPI {
  private authReq: (method: string, url: string) => agent.SuperAgentRequest;

  constructor(token: string) {
    this.authReq = authReqGenerator(token);
  }

  async get(id: string): Promise<Delivery> {
    let resp = await this.authReq('GET', `/deliveries/${id}`).send();
    return resp.body as Delivery;
  }

  async getByUser(): Promise<Delivery[]> {
    let resp = await this.authReq('GET', `/deliveries`).send();
    return resp.body as Delivery[];
  }

  async add(delivery: Delivery): Promise<Delivery> {
    let resp = await this.authReq('POST', `/deliveries`).send(delivery);
    return resp.body as Delivery;
  }

  async update(delivery: Delivery): Promise<Delivery> {
    let resp = await this.authReq('PUT', `/deliveries/${delivery.id}`).send(delivery);
    return resp.body as Delivery;
  }

  async delete(delivery: Delivery): Promise<boolean> {
    let resp = await this.authReq('DELETE', `/deliveries/${delivery.id}`).send(delivery);
    return resp.status === 200;
  }

  private toDelivery(response: any): Delivery {
    const { _id: id, __v: v, query, mailings, ...other } = response;
    return {
      id: id,
      query: this.toQuery(query),
      mailings: mailings.map(this.toMailing),
      ...other
    } as Delivery;
  }

  private toQuery(response: any): Query {
    const { _id: id, ...other } = response;
    return {
      ...other
    } as Query;
  }

  private toMailing(response: any): Mailing {
    const { _id: id, ...other } = response;
    return {
      datetime: other.datetime,
      articles: other.articles.map(this.toArticle)
    } as Mailing;
  }

  private toArticle(response: any): Article {
    const { _id: id, ...other } = response;
    return { ...other } as Article;
  }
}

export const DeliveryApi = new DeliveryAPI(ApiHelper.token);