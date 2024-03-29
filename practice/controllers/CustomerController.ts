import { ICustomer } from "../model/Customer.ts";
import { default as custRepo } from "../repository/CustomerRepo.ts";

const getCustomers = async ({ response }: { response: any }) => {
  try {
    const result = await custRepo.getCustomers();
    response.status = 200;
    response.body = result;
  } catch (error) {
    response.status = 500;
    response.body = {
      err: error.toString(),
    };
  }
};

const getCustomer = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  try {
    const result = await custRepo.getCustomer(params.id);
    if (result.toString() === "") {
      response.status = 404;
      response.body = { err: "Customer " + params.id + " is not registered" };
      return;
    } else {
      response.status = result;
      response.status = 200;
    }
  } catch (error) {
    response.status = 500;
    response.body = { err: error.toString() };
  }
};

const addCustomer = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const customer: ICustomer = await body.value;
  if (customer.name === "") {
    response.body = {
      err: "Name cannot be empty",
    };
    response.status = 500;
    return;
  }
  try {
    const result = await custRepo.addCustomer(customer);
    response.body = result;
    response.status = 201;
  } catch (error) {
    response.status = 500;
    response.body = { err: error.message };
  }
};

const updateCustomer = async (
  { params, request, response }: {
    params: { id: string };
    request: any;
    response: any;
  },
) => {
  await getCustomer({ params: { "id": params.id }, response });
  if (response.status === 404) {
    const errMsg = response.body.err;
    response.body = { err: errMsg };
    response.status = 404;
    return;
  } else {
    const body = await request.body();
    const customer: ICustomer = await body.value;

    if (customer.name === "" || customer.name == null) {
      response.body = { err: "Name cannot be empty" };
      response.status = 500;
      return;
    }
    try {
      const result = await custRepo.updateCustomer(params.id, customer);
      response.body = result;
      response.status = 200;
    } catch (error) {
      response.status = 500;
      response.body = { err: error.message };
    }
  }
};

const deleteCustomer = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  await getCustomer({ params: { "id": params.id }, response });
  if (response.status === 404) {
    const errMsg = response.body.err;
    response.status = 404;
    response.body = { err: errMsg };
    return;
  }
  try {
    await custRepo.deleteCustomer(params.id);
    response.body = { msg: "Customer id:" + params.id + " has been deleted." };
    response.status = 204;
  } catch (error) {
    response.status = 500;
    response.body = { err: error.message };
  }
};

export {
  addCustomer,
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
};
