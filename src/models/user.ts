import { authReqGenerator, publicReq } from './api';
import * as agent from "superagent";
import { ApiHelper } from './apiHelper';

export interface User {
  id: string;
  username: string;
  active: boolean;
  email?: string;
  kindle_email?: string;
  token: string;
  type: string;
}

export class UserAPI {
  private authReq: (method: string, url: string) => agent.SuperAgentRequest;

  constructor(token: string) {
    this.authReq = authReqGenerator(token);
  }

  public async get(id: string): Promise<User> {
    let resp = await this.authReq('GET', `/users/${id}`).send();
    return this.toUser(resp.body);
  }

  public async add(user: User): Promise<User> {
    let resp = await this.authReq('POST', `/users`).send(user);
    return this.toUser(resp.body);
  }

  public async update(user: User): Promise<User> {
    let resp = await this.authReq('PUT', `/users/${user.id}`).send(user);
    return this.toUser(resp.body);
  }

  public async delete(user: User): Promise<boolean> {
    let resp = await this.authReq('DELETE', `/users/${user.id}`).send(user);
    return resp.status === 200;
  }

  private toUser(response: any): User {
    const { _id: id, __v: v, ...other } = response;
    return {
      id: id,
      ...other
    } as User;
  }
}

export const UserApi = new UserAPI(ApiHelper.token);