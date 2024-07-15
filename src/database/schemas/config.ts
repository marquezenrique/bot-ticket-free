import { Schema } from "mongoose";

export const configSchema = new Schema(
  {
    _id: { type: String, required },
    topic: { type: String, required },
    role: { type: String, required },
    logs: { type: String, required },
  },
  {
    statics: {
      async get(guildId: string) {
        const query = { _id: guildId };
        return (await this.findOne(query)) ?? false;
      },
      async generate(guildId: string, data: { [key: string]: string }) {
        const query = { _id: guildId };
        const request = await this.findOne(query);
        if (request) {
          return await this.updateOne(
            {
              _id: guildId,
            },
            { ...data }
          );
        } else {
          const payload = { ...query, ...data };
          return this.create(payload);
        }
      },
    },
  }
);
