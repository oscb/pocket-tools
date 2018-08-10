import { AuthAPI } from './auth';
import { User } from './user';

class APIHelper {
  public token?: string;
  private code?: string;

  get isAuthenticated() {
    return this.token !== null;
  }

  get hasCode() {
    return this.code !== null;
  }

  constructor() {
    this.token = localStorage.getItem('token');
    this.code = localStorage.getItem('code');
  }

  async login() {
    const authApi = new AuthAPI();
    let resp = await authApi.getLoginUrl();
    localStorage.setItem('code', resp.code);
    window.location.href = resp.login_url;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async authUser(): Promise<User> {
    if (!this.hasCode) {
      throw new Error('Auth Error: No code in localStorage. Did you call .login() before?');
    }
    const authApi = new AuthAPI();
    let user = await authApi.authUser(this.code);
    this.token = user.token;
    this.code = null;
    localStorage.removeItem('code');
    localStorage.setItem('token', this.token);
    localStorage.setItem('user', JSON.stringify(user));
    return user;
  }
}

export const ApiHelper = new APIHelper();