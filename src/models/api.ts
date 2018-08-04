import * as agent from "superagent";
import { SuperAgentRequest } from "superagent";

export class RequestBuilder {
  private api_url: string;
  private token?: string;
  private code?: string;

  constructor(api_url: string, token?: string, code?: string) {
    this.api_url = api_url;
    this.token = token;
    this.code = code;
  }

  get(endpoint: string, withAuth: boolean = true): Request {
    return this.useAuth(Request.get(`${this.api_url}/${endpoint}`).json());
  }

  post(endpoint: string, withAuth: boolean = true): Request {
    return this.useAuth(Request.get(`${this.api_url}/${endpoint}`).json());
  }

  put(endpoint: string, withAuth: boolean = true): Request {
    return this.useAuth(Request.get(`${this.api_url}/${endpoint}`).json());
  }

  delete(endpoint: string, withAuth: boolean = true): Request {
    return this.useAuth(Request.get(`${this.api_url}/${endpoint}`).json());
  }

  private useAuth(req: Request, enabled: boolean = true): Request {
    if (enabled) {
      return req.withAuth(this.token);
    }
    return req;
  }
}


/**
 * Basic Wrapper for SuperAgentRequest for this project
 *
 * @class Request
 */
export class Request {
  private req: agent.SuperAgentRequest;

  private constructor(req: agent.SuperAgentRequest) {
    this.req = req;
  }

  static get(endpoint: string) {
    return new Request(agent.get(endpoint));
  }

  static post(endpoint: string) {
    return new Request(agent.post(endpoint));
  }

  static put(endpoint: string) {
    return new Request(agent.put(endpoint));
  }

  static delete(endpoint: string) {
    return new Request(agent.delete(endpoint));
  }

  json(): Request {
    this.req
      .set("Content-Type", "application/json")
      .type("application/json")
      .accept("application/json");
    return this;
  }

  withAuth(token: string): Request {
    this.req
      .set('Authorization', `Bearer ${token}`);
    return this;
  }

  // Not sure about this pattern... 
  // I might do a constructor instead for agent requests
  // Might look like:
  // const builder = new RequestBuilder(API_URL);
  // await builder.get("endpoint").withAuth().json().request.send()
  // vs
  // await builder.get("endpoint").send()

  // Nice idea for a factory wrapper!
  // import request from 'superagent';
  // import localStorage from 'localStorage';

  // const superagent = () => request

  async send(data?: any): Promise<any> {
    return this.req.send(data);
  }

  async query(data?: any): Promise<any> {
    return this.req.query(data);
  }
}