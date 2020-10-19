import { Router } from "https://deno.land/x/oak/mod.ts";
import { getHome } from "../controllers/HomeController.ts";

const homeRouter = new Router();
homeRouter.get("/", getHome);

export default homeRouter;
