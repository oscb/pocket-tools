import * as agent from "superagent";

export const publicReq = (method: string, url: string) => 
  agent(method, url)
    .timeout(5000)
    .use(apiPrefix)
    .use(asJson);

export const authReqGenerator = (token: string) =>(method: string, url: string) => authReq(method, url, token);

export const authReq = (method: string, url: string, token: string) => 
  agent(method, url)
    .timeout(5000)
    .use(apiPrefix)
    .use(asJson)
    .use(addTokenGenerator(token));

function apiPrefix(req: agent.SuperAgentRequest): void {
  if (req.url[0] === '/') {
    req.url = `${process.env.API_URL}${req.url}`;
  }
}

function addTokenGenerator(token: string): (req: agent.SuperAgentRequest) => void {
  return (req) => req.set('Authorization', `Bearer ${token}`);
}

function asJson(req: agent.SuperAgentRequest): void {
  req.set("Content-Type", "application/json")
    .type("application/json")
    .accept("application/json");
}