import { Client } from "https://deno.land/x/postgres/mod.ts";
import { connString } from "../config.ts";

class DbConnection {
  client!: Client;

  constructor() {
    this.Connect();
  }
  private async Connect() {
    this.client = new Client(connString);
    await this.client.connect();
  }
}

export default new DbConnection().client;
