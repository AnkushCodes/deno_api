import { ICustomer } from "../model/Customer.ts";
import DbConnection from "../database/DbConnection.ts";

class CustomerRepo {
  async getCustomers() {
    const result = await DbConnection.query("select * from customer;");
    return result.rows;
  }

  async getCustomer(id: string) {
    const result = await DbConnection.query(
      "select * from customer where customerid=$1;",
      id,
    );
    return result.rows;
  }

  async addCustomer(customer: ICustomer) {
    const result = await DbConnection.query(
      "insert into customer(companyname,city,country) values($1,$2,$3)",
      customer.name,
      customer.city,
      customer.country,
    );
    return customer;
  }

  async updateCustomer(id: string, customer: ICustomer) {
    await DbConnection.query(
      "update customer set companyname=$1,city=$2,country=$3 where customerid=$4",
      customer.name,
      customer.city,
      customer.country,
    );
    return customer;
  }

  async deleteCustomer(id: string) {
    await DbConnection.query(
      "delete from customer where customerid=$1",
      id,
    );
  }
}

export default new CustomerRepo();
