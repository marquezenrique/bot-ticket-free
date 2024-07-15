import { ApplicationCommandType } from "discord.js";
import { Command } from "#base";
import { res } from "#responses";

const link = "https://github.com/marquezzx/bot-ticket-free";

new Command({
  name: "source",
  description: "Pegar source code deste bot!",
  type: ApplicationCommandType.ChatInput,
  async run(interaction) {
    interaction.reply(
      res.white(
        `\`✉️\` Clique [aqui](${link}) para ser redirecionado ao repositório do meu código fonte!`
      )
    );
  },
});
