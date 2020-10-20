import {
  bgBlue,
  bold,
  green,
} from "https://deno.land/std@0.74.0/fmt/colors.ts";
import homeRouter from "./routes/HomeRoute.ts";
import { Application } from "https://deno.land/x/oak/mod.ts";
import NotFound from "./controllers/NotFoundController.ts";
import customerRouter from "./routes/CustomerRoute.ts";
import userRouter from "./routes/UserRoute.ts";

const app = new Application();
const env = Deno.env.toObject();
const HOST = env.HOST || "127.0.0.1";
const PORT = env.PORT || 8180;

app.use(homeRouter.routes());

app.use(customerRouter.routes());
app.use(userRouter.routes());
console.log(bgBlue(bold(green(`${HOST} ${PORT}`))));
app.use(NotFound);
await app.listen(`${HOST}:${PORT}`);
