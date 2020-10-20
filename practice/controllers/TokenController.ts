import {
  Jose,
  makeJwt,
  Payload,
  setExpiration,
} from "https://deno.land/x/djwt/create.ts";
import { key } from "../config.ts";
import { getUser } from "../controllers/UserController.ts";
import { IUser } from "../model/User.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

export const getToken = async (
  { request, response }: {
    request: any;
    response: any;
  },
) => {
  const body = await request.body();
  try {
    const user: IUser = await body.value;
    await getUser({ params: { "name": user.username }, response });
    if (response.status === 404) {
      const errMsg = response.body.err;
      response.body = { err: errMsg };
      response.status = 404;
      return;
    } else {
      const currentHashPwd = response.body[0][1];
      const isPwdMatch = bcrypt.compare(user.password, currentHashPwd);
      if (!isPwdMatch) {
        response.body = {
          err: "Username / password do not match",
        };
        response.status = 404;
        return;
      } else {
        const payload: Payload = {
          iss: user.username,
          exp: setExpiration(new Date("2020-12-31")),
        };
        const header: Jose = {
          alg: "HS256",
          type: "JWT",
        };
        const jwt = makeJwt({ header, payload, key });
        response.body = { token: jwt, username: payload.iss };
        response.status = 200;
      }
    }
  } catch (error) {
    response.status = 500;
    response.body = { err: error.toString() };
  }
};
