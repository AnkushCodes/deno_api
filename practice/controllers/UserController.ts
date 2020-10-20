import { Client } from "https://deno.land/x/postgres/mod.ts";
import { IUser } from "../model/User.ts";
import { connString } from "../config.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";

const client = new Client(connString);
const getUsers = async ({ response }: { response: any }) => {
  try {
    await client.connect();
    const result = await client.query("select * from users");
    response.status = 200;
    response.body = result.rows;
  } catch (error) {
    response.status = 500;
    response.body = { err: error.toString() };
  } finally {
    await client.end();
  }
};

const getUser = async (
  { params, response }: { params: { name: string }; response: any },
) => {
  try {
    await client.connect();
    const result = await client.query(
      "select * from users where username=$1;",
      params.name,
    );
    if (result.rows.toString() == "") {
      response.status = 404;
      response.body = {
        err: "Username:" + params.name +
          " is not registered.",
      };
      return;
    } else {
      response.body = result.rows;
      response.status = 200;
    }
  } catch (error) {
    response.status = 500;
    response.body = { err: error.toString() };
  }
};

const addUser = async (
  { request, response }: { request: any; response: any },
) => {
  const body = await request.body();
  const user: IUser = await body.value;

  if (user.username === "" || user.password === "") {
    response.body = {
      err: "User & Password cannot be empty",
    };
    response.status = 500;
    return;
  }

  try {
    const hash = await bcrypt.hash(user.password);
    await client.connect();
    const result = await client.query(
      "insert into users values($1,$2)",
      user.username,
      hash,
    );
    response.body = user;
    response.status = 201;
  } catch (error) {
    console.log(error);
    response.status = 500;
    response.body = { err: error.message };
  } finally {
    await client.end();
  }
};

const updatePassword = async (
  { params, request, response }: {
    params: { name: string };
    request: any;
    response: any;
  },
) => {
  await getUser(
    { params: { "name": params.name }, response },
  );
  if (response.status === 404) {
    const errMsg = response.body.err;
    response.body = { err: errMsg };
    response.status = 404;
    return;
  } else {
    const body = await request.body();
    const user = await body.value;
    const currentHashPwd = response.body[0][1];
    const isPwdMatch = bcrypt.compare(user.password, currentHashPwd);

    if (!isPwdMatch) {
      response.body = { err: "Username/password do not match" };
      response.status = 404;
      return;
    } else {
      const hash = await bcrypt.hash(user.newpassword);

      try {
        await client.connect();
        const result = await client.query(
          "update users set password=$1 where username=$2",
          hash,
          params.name,
        );
        response.body = { msg: "Password has been changes." };
        response.status = 200;
      } catch (error) {
        console.log(error);
        response.status = 500;
        response.body = { err: error.messgae };
      } finally {
        await client.end();
      }
    }
  }
};

const deleteUser = async (
  { params, response }: { params: { name: string }; response: any },
) => {
  await getUser({ params: { "name": params.name }, response });
  if (response.status === 404) {
    const errMsg = response.body.err;
    response.status = 404;
    response.body = { err: errMsg };
    return;
  }
  try {
    await client.connect();
    const result = await client.query(
      "delete from users where username=$1",
      params.name,
    );
    response.body = {
      msg: "Username " + params.name + " had been deleted.",
    };
    response.status = 204;
  } catch (error) {
    response.status = 500;
    response.body = { err: error.message };
  } finally {
    client.end();
  }
};

export { addUser, deleteUser, getUser, getUsers, updatePassword };
