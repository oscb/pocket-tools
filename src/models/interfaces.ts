import * as agent from "superagent";
import { Agent } from "http";
import { RequestBuilder } from "./api";

export class DeliveryAPI {}

export class User {
  id: string;
  username: string;
  active: boolean;
  email: string;
  kindle_email: string;
  token: string;
  type: string;
}

export class UserAPI {
  private code?: string | null;
  private token?: string | null;
  private api = new RequestBuilder(process.env.API_URL);

  get isAuthenticated() {
    return Boolean(this.token);
  }

  get hasReqToken() {
    return this.code != null && this.code !== "undefined";
  }

  constructor(token?: string | null, reqToken?: string | null) {
    this.token = token;
    this.code = reqToken;
  }

  async login() {
    let res = await this.api.get("users/login").query({
      redirect_uri: "http://localhost:8080"
    });
    if (res.error) {
      alert(res.error);
      return;
    }
    const pocketUrl = res.body.login_url;
    localStorage.setItem("req_token", res.body.code);
    this.code = res.body.code;
    window.location.href = pocketUrl;
  }

  async get_token() {
    let res = await this.api.post("users/login").send({ code: this.code });

    this.token = res.body.user.token;
    localStorage.removeItem("req_token");
    localStorage.setItem("token", this.token);
    localStorage.setItem("user", JSON.stringify(res.body.user));
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
    let user = await this.api.get(`users/${id}`, true).send({ token: this.token });
    return user;
  }

  async update_user(user: User) {
    let res = this.api.post(`users/${user.id}`, true).send(user);
    return res;
  }

  logout() {
    this.token = null;
    this.code = null;
    localStorage.removeItem("req_token");
    localStorage.removeItem("token");
  }
}
