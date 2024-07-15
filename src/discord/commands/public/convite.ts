import { ApplicationCommandType } from "discord.js";
import { Command } from "#base";
import { res } from "#responses";

const link =
  "https://discord.com/oauth2/authorize?client_id=999829021053427724&permissions=8&integration_type=0&scope=applications.commands+bot";

new Command({
  name: "convite",
  description: "Convidar o bot para seu servidor!",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    interaction.reply(
      res.white(
        `\`✉️\` Clique [aqui](${link}) para me convidar para seu servidor!`
      )
    );
  },
});
