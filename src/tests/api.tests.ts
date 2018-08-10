declare var jest, describe, it, expect;
import { publicReq, authReq } from '../models/api';
const dotenv = require('dotenv');
dotenv.config();


describe('Basic API Generators tests', () => {
  test('GET Login', async () => {
    const resp = await publicReq('GET', '/users/login').query({
      redirect_uri: "http://localhost:8080"
    });
    expect(resp.body.login_url).toBeDefined();
    // console.log(resp.body);
  });

  test('Authenticated GET UserData', async() => {
    const resp = await authReq(
      'GET', 
      `/users/5aefe9229e86218ba071c3e7`, 
      process.env.POCKET_TOKEN)
      .send();
    expect(resp.body._id).toBe('5aefe9229e86218ba071c3e7');
    console.log(resp.body);
  });
});