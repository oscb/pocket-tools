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
  articles: SentArticle[]
}

export interface SentArticle {
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
  autoArchive: boolean;
  day?: string;
  mailings?: Mailing[];
}

export interface Article {
  item_id: string;
  resolved_id: string;
  given_url: string;
  given_title: string;
  favorite: string;
  status: string;
  time_added: string;
  time_updated: string;
  time_read: string;
  time_favorited: string;
  sort_id: number;
  resolved_title: string;
  resolved_url: string;
  excerpt: string;
  is_article: string;
  is_index: string;
  has_video: string;
  has_image: string;
  word_count: string;
  lang: string;
  time_to_read: number;
  top_image_url: string;
  listen_duration_estimate: number;
}

export class DeliveryAPI {
  private authReq: (method: string, url: string) => agent.SuperAgentRequest;

  constructor(token: string) {
    this.authReq = authReqGenerator(token);
  }

  async get(id: string): Promise<Delivery> {
    let resp = await this.authReq('GET', `/deliveries/${id}`).send();
    return this.toDelivery(resp.body);
  }

  async getByUser(): Promise<Delivery[]> {
    let resp = await this.authReq('GET', `/deliveries`).send();
    return resp.body.map(this.toDelivery);
  }

  async add(delivery: Delivery): Promise<Delivery> {
    let resp = await this.authReq('POST', `/deliveries`).send(delivery);
    return this.toDelivery(resp.body);
  }

  async update(delivery: Delivery): Promise<Delivery> {
    let resp = await this.authReq('PUT', `/deliveries/${delivery.id}`).send(delivery);
    return this.toDelivery(resp.body);
  }

  async delete(delivery: Delivery): Promise<boolean> {
    let resp = await this.authReq('DELETE', `/deliveries/${delivery.id}`).send(delivery);
    return resp.status === 200;
  }

  async preview(id: string): Promise<Article[]> {
    let resp = await this.authReq('GET', `/deliveries/${id}/execute`).send();
    return resp.body.map(x => x as Article);
  }

  private toDelivery = (response: any): Delivery => {
    const { _id: id, __v: v, query, mailings, ...other } = response;
    return {
      id: id,
      query: this.toQuery(query),
      mailings: mailings.map(this.toMailing),
      ...other
    } as Delivery;
  }

  private toQuery = (response: any): Query => {
    const { _id: id, ...other } = response;
    return {
      ...other
    } as Query;
  }

  private toMailing = (response: any): Mailing => {
    const { _id: id, ...other } = response;
    return {
      datetime: other.datetime,
      articles: other.articles.map(this.toArticle)
    } as Mailing;
  }

  private toArticle = (response: any): SentArticle => {
    const { _id: id, ...other } = response;
    return { ...other } as SentArticle;
  }
}

export const DeliveryApi = new DeliveryAPI(ApiHelper.token);