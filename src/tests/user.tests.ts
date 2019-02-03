import { UserAPI, User } from "../models/user";
import { AuthAPI } from '../models/auth';
import { publicReq } from '../models/api';

declare var jest, describe, it, expect;
const dotenv = require('dotenv');
dotenv.config();

// TODO: Add a sample user in database
const user_sample: User = {
  id: '5aefe9229e86218ba071c3e7',
  username: 'oubi',
  active: true,
  token: process.env.TOKEN,
  subscription: 'Free'
}

describe('UserAPI Tests', () => {
  const userApi = new UserAPI(process.env.POCKET_TOKEN);
  const authApi = new AuthAPI();
  const code = "87927afd-bf48-6b7e-89d7-f0a2a0";
  // const login_url = "https://getpocket.com/auth/authorize?request_token=87927afd-bf48-6b7e-89d7-f0a2a0&redirect_uri=http://localhost:8080";

  test.only('Login', async () => {
    const login = await authApi.getLoginUrl();
    expect(login.code).toBeDefined();
    expect(login.login_url).toEqual(expect.stringContaining('https://getpocket.com/auth/authorize'));
    console.log(login.login_url);
  });

  test('GetToken', async () => {
    const user = await authApi.authUser(code);
    expect(user).toBeDefined();
    console.log(user);
  })

  test('Get', async () => {
    let user = await userApi.get('5aefe9229e86218ba071c3e7');
    expect(user).toEqual(user_sample);
  });

  test('Update', async() => {
    const updated_user: User = {
      ...user_sample,
      email: 'somerando@gmail.com',
      kindle_email: 'somerando@kindle.com'
    }
    let user = await userApi.update(updated_user);
    expect(user).toEqual(updated_user);

    user = await userApi.get('5aefe9229e86218ba071c3e7');
    expect(user).toEqual(updated_user);
  });

  // test('Delete', async() => {
  //   let isDeleted = await userApi.delete(user_sample);
  //   expect(isDeleted).toBe(false);

  //   let user = await userApi.get('5aefe9229e86218ba071c3e7');
  //   expect(user).toBe(null);
  // });

  test('Add', async() => {
    let user = await userApi.add(user_sample);
    expect(user).toEqual(user_sample);
  });
});