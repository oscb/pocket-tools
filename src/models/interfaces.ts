import * as agent from 'superagent';
import { Agent } from 'http';

const API_PREFIX = 'http://Luna.local:3000';


export class DeliveryAPI {

}

export class UserAPI {
  private code?: string | null;
  private token?: string | null;
  private api = new API();

  get isAuthenticated() {
    return Boolean(this.token);
  }

  get hasReqToken() {
     return (this.code != null && this.code !== 'undefined');
  }

  constructor(token?: string | null, reqToken?: string | null) {
    this.token = token;
    this.code = reqToken;
  }

  async login() {
    let res = await this.api
      .get('users/login')
      .query({
        redirect_uri: 'http://Luna.local:3001'
      });
    if (res.error) {
      alert(res.error);
      return;
    }
    const pocketUrl = res.body.login_url;
    localStorage.setItem('req_token', res.body.code);
    this.code = res.body.code;
    window.location.href = pocketUrl;
  }

  async get_token() {
    let res = await this.api
      .post('users/login')
      .send({ code: this.code });

    this.token = res.body.user.token;
    localStorage.removeItem('req_token');
    localStorage.setItem('token', res.body.token);
    localStorage.setItem('user', res.body.user);
    return res.body;
  }

  // get_deliveries() {
  //   return this.api_get('deliveries')
  //     .send({ token: this.reqToken })
  //     .then((res: any) => {
  //       // Transform res to Deliveries object
  //       console.log(res);
  //       return res as Deliveries
  //     });
  // }

  async get_user(id: string) {
    let user = await this.api.get('user').send({id: id});
    return user;
  }

  logout() {
    this.token = null;
    this.code = null;
    localStorage.removeItem('req_token');
    localStorage.removeItem('token');
  }

}

class API {
  get(endpoint: string): agent.SuperAgentRequest {
    return this.json(agent.get(`${API_PREFIX}/${endpoint}`));
  }
  
  post(endpoint: string): agent.SuperAgentRequest {
    return this.json(agent.post(`${API_PREFIX}/${endpoint}`));
  }

  put(endpoint: string): agent.SuperAgentRequest {
    return this.json(agent.put(`${API_PREFIX}/${endpoint}`));
  }

  delete(endpoint: string): agent.SuperAgentRequest {
    return this.json(agent.delete(`${API_PREFIX}/${endpoint}`));
  }
  
  private json(request: agent.SuperAgentRequest): agent.SuperAgentRequest {
    return request
      .set('Content-Type', 'application/json')
      .type('application/json')
      .accept('application/json');
  }
}