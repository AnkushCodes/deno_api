import { Client } from "https://deno.land/x/postgres/mod.ts";
import { connString } from "../config.ts";
import { ICustomer } from "../model/Customer.ts";

const client = new Client(connString);

const getCustomers = async ({ response }: { response: any }) => {
  try {
    await client.connect();
    const result = await client.query("select * from customer");
    response.status = 200;
    response.body = result.rows;
  } catch (error) {
    response.status = 500;
    response.body = { err: error.toString() };
  } finally {
    await client.end();
  }
};

const getCustomer = async (
  { params, response }: { params: { id: string }; response: any },
) => {
  try {
    await client.connect();
    const result = await client.query(
      "select * from customer where customerid=$1",
      params.id,
    );
    if (result.rows.toString() === "") {
      response.status = 404;
      response.body = {
        err: "Customer" + params.id + "is not registered",
      };
      return;
    } else {
      response.body = result.rows;
      response.status = 200;
    }
  } catch (error) {
    response.body = { err: error.toString() };
    response.status = 200;
  } finally {
    await client.end();
  }
};

const addCustomer = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const customer: ICustomer = await body.value;

  console.log(body.value);

  if (customer.name === "") {
    response.body = { err: "Name cannot be empty." };
    response.status = 500;
    return;
  }

  try {
    await client.connect();
    const result = await client.query(
      "insert into customer(companyname,city,country) values ($1,$2,$3)",
      customer.name,
      customer.city,
      customer.country,
    );
    response.body = customer;
    response.status = 201;
  } catch (error) {
    response.body = { err: error.message };
    response.status = 500;
  } finally {
    await client.end();
  }
};

const updateCustomer = async ({
  params,
  request,
  response,
}: {
  params: { id: string };
  request: any;
  response: any;
}) => {
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
      await client.connect();
      await client.query(
        "update customer set companyname=$1,city=$2,country=$3 where customerid=$4",
        customer.name,
        customer.city,
        customer.country,
        params.id,
      );
      response.body = customer;
      response.status = 200;
    } catch (error) {
      response.status = 500;
      response.body = { err: error.message };
    } finally {
      await client.end();
    }
    // }
  }
};

const deleteCustomer =async(
  {params,response}:{params:{id:string};
response:any
},)=>{
await getCustomer({params:{"id":params.id},response});
if(response.status ===400){
  const errMsg =response.body.err;
  response.status =404;
  response.body ={err:errMsg};
  return;
}
try{
await client.connect();
const result =await client.query("delete from customer where customerid=$1",
    params.id);
    response.status =204;
}catch(error){
response.status =500;
response.body={err:error.message};
}finally{
  await client.end();
}
};
export { addCustomer, getCustomer,
   getCustomers, updateCustomer,
  deleteCustomer
  };
