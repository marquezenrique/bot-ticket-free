import { ActivityType } from "discord.js";
import { Event } from "#base";

const activivites = [
  "📩 /convite para me convidar!",
  "🕹️ Gerenciando tickets da rapaziada!",
];

new Event({
  name: "Activity handler",
  event: "ready",
  async run(client) {
    let index = 0;
    setInterval(() => {
      client.user?.setPresence({ status: "dnd" });
      client.user?.setActivity(activivites[index], {
        type: ActivityType.Listening,
      });
      index = (index + 1) % activivites.length;
    }, 10000);
  },
});
