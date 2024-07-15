import { Responder, ResponderType } from "#base";

import { TextInputStyle } from "discord.js";
import { createModalFields } from "@magicyan/discord";
import { db } from "#database";
import { res } from "#responses";

new Responder({
  customId: "ticket/rename",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction) {
    const config: any = await db.config.get(interaction.guild.id);
    const isStaff = interaction.member.roles.cache.find(
      (r) => r.id === config.role
    );
    if (!isStaff) {
      return interaction.reply(
        res.danger("`❌` Você não possui permissão para utilizar esta função.")
      );
    }
    return interaction.showModal({
      customId: "ticket/rename/input",
      title: "Renomear ticket",
      components: createModalFields({
        name: {
          label: "Qual será o novo nome do ticket?",
          minLength: 1,
          placeholder: "📄 Digite aqui",
          style: TextInputStyle.Short,
        },
      }),
    });
  },
});
