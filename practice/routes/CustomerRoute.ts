import { Router } from "https://deno.land/x/oak/mod.ts";
import {
  addCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
} from "../controllers/CustomerController.ts";
import { getColorEnabled } from "https://deno.land/std@0.73.0/fmt/colors.ts";
import { Client } from "https://deno.land/x/postgres@v0.4.5/client.ts";

const customerRouter = new Router();
let path = "/api/customer/";

customerRouter.get(path, getCustomers)
  .get(path + ":id", getCustomer)
  .post(path, addCustomer)
  .put(path + ":id", updateCustomer)
  .delete(path + ":id", deleteCustomer);
export default customerRouter;
