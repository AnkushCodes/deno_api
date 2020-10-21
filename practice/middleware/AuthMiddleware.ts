import { validateJwt } from "https://deno.land/x/djwt/validate.ts";
import { key } from "../config.ts";

export const authMiddleware = async (context: any, next: any) => {
  let jwt: string = "";

  if (
    context.request.headers.get("authorization") &&
    context.request.headers.get("authorization").split(" ")[0] == "Bearer"
  ) {
    jwt = context.request.headers.get("authorization").split(" ")[1];
  } else if (context.request.url.searchParams.get("token")) {
    jwt = context.request.url.searchParams.get("token");
  } else {
    const body = await context.request.body();
    const jwtdata = await body.value;
    if (jwtdata != null && jwtdata.token != null) {
      jwt = jwtdata.token;
    }
  }
  if (jwt !== "") {
    try {
      validateJwt({
        jwt,
        key,
        algorithm: "HS256",
      });
      await next();
    } catch (error) {
      context.reponse.status = 401;
      context.reponse.body = {
        err: "Unauthorised. Token is not valid, try to login again.",
      };
    }
  } else {
    context.response.status = 401;
    context.response.body = {
      err: "Unauthorised. Please login first.",
    };
  }
};
