import { publicReq } from './api';
import { User } from './user';

interface LoginData {
  code: string, 
  login_url: string
}

export class AuthAPI {

  public async getLoginUrl(): Promise<LoginData> {
    const resp = await publicReq('GET', '/users/login').query({
      redirect_uri: "http://localhost:8080" // TODO: Configurable
    });
    if (resp.error) {
      throw new Error('API Error: Retrieving Login URL');
    }
    return resp.body as LoginData;
  }

  public async authUser(code: string): Promise<User> {
    const resp = await publicReq('POST', '/users/login').send({ code: code });
    if (resp.error) {
      throw new Error('API Error: Retrieving token');
    }
    return resp.body.user as User;
  }
}
