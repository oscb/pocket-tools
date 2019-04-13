import { publicReq, authReq } from './api';
import { User } from './user';

interface LoginData {
  code: string, 
  login_url: string
}

export class AuthAPI {

  public async getLoginUrl(): Promise<LoginData> {
    const resp = await publicReq('GET', '/auth').query({
      redirect_uri: process.env.REDIRECT_URL
    });
    if (resp.error) {
      throw new Error('API Error: Retrieving Login URL');
    }
    return resp.body as LoginData;
  }

  public async authUser(code: string): Promise<User> {
    const resp = await publicReq('POST', '/auth').send({ code: code });
    if (resp.error) {
      throw new Error('API Error: Retrieving token');
    }
    return resp.body.user as User;
  }
}
