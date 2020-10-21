import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  addCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/CustomerController.ts";
import { authMiddleware } from "../middleware/AuthMiddleware.ts";

const customerRouter = new Router();
let path = "/api/customer/";

customerRouter.get(path, getCustomers)
  .get(path + ":id", getCustomer)
  .post(path, authMiddleware, addCustomer)
  .put(path + ":id", authMiddleware, updateCustomer)
  .delete(path + ":id", authMiddleware, deleteCustomer);

export default customerRouter;
