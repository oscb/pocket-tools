import { AuthAPI } from './auth';
import { User, UserAPI } from './user';

class APIHelper {
  public user?: User;
  public token?: string;
  private code?: string;

  get isAuthenticated(): boolean {
    return this.token !== null;
  }

  get hasCode(): boolean {
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

  async getUserData(): Promise<User> {
    if (this.user !== undefined && this.user !== null) {
      return this.user;
    } else if (this.token !== undefined && this.token !== null) {
      const userApi = new UserAPI(this.token);
      this.user = await userApi.me()
    } else if (this.token !== null) {
      this.user = await this.authUser();
    }
    return this.user;
  }

  async authUser(): Promise<User> {
    if (!this.hasCode) {
      throw new Error('Auth Error: No code in localStorage. Did you call .login() before?');
    }
    const authApi = new AuthAPI();
    let user = await authApi.authUser(this.code);
    this.token = user.token;
    this.code = null;
    this.user = user;
    localStorage.removeItem('code');
    localStorage.setItem('token', this.token);
    return user;
  }
}

export const ApiHelper = new APIHelper();