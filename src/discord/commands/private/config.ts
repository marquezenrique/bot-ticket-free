import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";

import { Command } from "#base";
import { db } from "#database";
import { res } from "lib/responses.js";

new Command({
  name: "config",
  description: "Configure the ticket system",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "categoria",
      description: "Categoria onde serão armazenados os tickets",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "cargo",
      description: "Cargo que terá acesso aos tickets",
      type: ApplicationCommandOptionType.Role,
      required: true,
    },
    {
      name: "logs",
      description: "Canal onde serão enviados os logs do ticket",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  async run(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply(
        res.danger(
          "`❌` Apenas o dono do servidor pode configurar o *Sistema de Tickets*"
        )
      );
    }

    const { options } = interaction;
    const topic = options.getChannel("categoria");
    if (!topic || topic.type !== 4) {
      return interaction.reply(
        res.danger(
          "`❌` Apenas categorias podem ser utilizadas como categoria de tickets."
        )
      );
    }

    const role = options.getRole("cargo");
    if (!role) return;

    const logs = options.getChannel("logs");
    if (!logs || logs.type !== 0) {
      return interaction.reply(
        res.danger(
          "`❌` Apenas canais de texto podem ser utilizados como *LOGS*."
        )
      );
    }

    await db.config.generate(interaction.guild.id, {
      topic: topic.id,
      role: role.id,
      logs: logs.id,
    });

    return interaction.reply(
      res.success(
        "### `✅` Configurado\n> O **Sistema de Ticket** foi *configurado* com sucesso! Agora, para iniciar seu funcionamento, utilize o comando `/start [canal]`."
      )
    );
  },
});
