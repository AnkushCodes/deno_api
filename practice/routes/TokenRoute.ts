import { Router } from "https://deno.land/x/oak/mod.ts";
import { getToken } from "../controllers/TokenController.ts";

const tokenRouter = new Router();
tokenRouter.post("/auth/", getToken);
export default tokenRouter;
