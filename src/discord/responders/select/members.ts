import { Responder, ResponderType } from "#base";

import { TextInputStyle } from "discord.js";
import { createModalFields } from "@magicyan/discord";

new Responder({
  customId: "ticket/members/select",
  type: ResponderType.StringSelect,
  cache: "cached",
  async run(interaction) {
    const action = interaction.values[0];

    const showModal = (customId: string, title: string, label: string) => {
      interaction.showModal({
        customId,
        title,
        components: createModalFields({
          addedUser: {
            label,
            placeholder: "✍️ Digite aqui",
            style: TextInputStyle.Short,
          },
        }),
      });
    };

    switch (action) {
      case "add":
        showModal(
          "ticket/members/input/add",
          "Adicionar Membro",
          "Qual é o ID do membro que será adicionado?"
        );
        break;
      case "remove":
        showModal(
          "ticket/members/input/remove",
          "Remover Membro",
          "Qual é o ID do membro que será removido?"
        );
        break;
    }

    interaction.deferUpdate();
  },
});
