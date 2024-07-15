import { Schema } from "mongoose";

export const ticketSchema = new Schema(
  {
    protocol: { type: String, required, unique: true },
    channel: { type: String, required, unique: true },
    guild: { type: String, required, unique: false },
    user: { type: String, required, unique: false },
  },
  {
    statics: {
      async getByUser(userId: string) {
        const query = { user: userId };
        return (await this.findOne(query)) ?? false;
      },
      async getByChannel(channelId: string) {
        const query = { channel: channelId };
        return (await this.findOne(query)) ?? false;
      },
      async generate(
        protocol: string,
        channelId: string,
        userId: string,
        guildId: string
      ) {
        const query = { protocol: protocol };
        const request = await this.findOne(query);
        if (request) {
          return await this.updateOne(
            {
              protocol: protocol,
            },
            {
              guild: guildId,
              channel: channelId,
              user: userId,
            }
          );
        } else {
          const payload = {
            ...query,
            channel: channelId,
            user: userId,
            guild: guildId,
          };
          return this.create(payload);
        }
      },
      async removeByUser(userId: string) {
        return await this.deleteOne({ user: userId });
      },
    },
  }
);
