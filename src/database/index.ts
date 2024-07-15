import mongoose, { InferSchemaType, model } from "mongoose";

import chalk from "chalk";
import { configSchema } from "./schemas/config.js";
import { log } from "#settings";
import { ticketSchema } from "./schemas/ticket.js";

try {
  await mongoose.connect(process.env.MONGO_URI, { dbName: "database" });
  log.success(chalk.green("MongoDB connected"));
} catch (err) {
  log.error(err);
  process.exit(1);
}

export const db = {
  config: model("config", configSchema, "config"),
  ticket: model("ticket", ticketSchema, "ticket"),
};

export type ConfigSchema = InferSchemaType<typeof configSchema>;
export type TicketSchema = InferSchemaType<typeof ticketSchema>;
