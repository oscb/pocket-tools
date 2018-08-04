declare var jest, describe, it, expect;
import { RequestBuilder, Request } from '../models/api';
const dotenv = require('dotenv');
dotenv.config();


describe('Test Login Get', () => {
  test('Login should not fail', async () => {
    const builder = new RequestBuilder(process.env.API_URL);
    const resp = await builder.get('users/login').query({
      redirect_uri: "http://localhost:8080"
    });
    expect(resp.body.login_url).toBeDefined();
    console.log(resp.body);
  });

  test('Query User Data should return', async() => {
    const resp = await Request
      .get(`${process.env.API_URL}/users/5aefe9229e86218ba071c3e7`)
      .withAuth(process.env.POCKET_TOKEN)
      .send({});
    console.log(resp);
  });
});