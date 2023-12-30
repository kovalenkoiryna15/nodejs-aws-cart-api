import { Callback, Context, Handler } from "aws-lambda";
const app = require('../../../dist/main.js');

let server: Handler;

export async function cartHandler(event: any, context: Context, callback: Callback): Promise<void> {
  server = server ?? (await app.bootstrap());
  return server(event, context, callback);
}
