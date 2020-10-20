import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  addUser,
  deleteUser,
  getUser,
  getUsers,
  updatePassword,
} from "../controllers/UserController.ts";

const userRouter = new Router();
let path = "/api/user/";

userRouter
  .get(path, getUsers)
  .get(path + ":name", getUser)
  .post(path, addUser)
  .put(path + ":name", updatePassword)
  .delete(path + ":name", deleteUser);

export default userRouter;
