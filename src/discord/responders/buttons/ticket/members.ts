import { ButtonBuilder, ButtonStyle, TextInputStyle } from "discord.js";
import { Responder, ResponderType } from "#base";
import { createEmbed, createModalFields, createRow } from "@magicyan/discord";

import { db } from "#database";
import { res } from "#responses";
import { settings } from "#settings";

new Responder({
  customId: "ticket/members/menu",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction) {
    const config: any = await db.config.get(interaction.guild.id);
    const isStaff = interaction.member.roles.cache.some(
      (r) => r.id === config.role
    );

    if (!isStaff) {
      return interaction.reply(
        res.danger("`❌` Você não possui permissão para utilizar esta função.")
      );
    }
    const embed = createEmbed({
      color: settings.colors.default,
      description:
        "### `👥` Gerenciamento de Membros\n > Selecione a ação que deseja tomar:",
    });

    const actions = createRow(
      new ButtonBuilder({
        emoji: "➕",
        customId: "ticket/members/handle/add",
        label: "Adicionar",
        style: ButtonStyle.Success,
      }),
      new ButtonBuilder({
        emoji: "➖",
        customId: "ticket/members/handle/remove",
        label: "Remover",
        style: ButtonStyle.Danger,
      })
    );

    return interaction.reply({
      ephemeral: true,
      embeds: [embed],
      components: [actions],
    });
  },
});

new Responder({
  customId: "ticket/members/handle/:action",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction, { action }) {
    const modalConfig: {
      [key: string]: {
        customId: string;
        title: string;
        label: string;
      };
    } = {
      add: {
        customId: "ticket/members/input/add",
        title: "Adicionar Membro",
        label: "Qual é o ID do membro que será adicionado?",
      },
      remove: {
        customId: "ticket/members/input/remove",
        title: "Remover Membro",
        label: "Qual é o ID do membro que será removido?",
      },
    };

    const config = modalConfig[action];

    if (!config) return;

    interaction.showModal({
      customId: config.customId,
      title: config.title,
      components: createModalFields({
        id: {
          label: config.label,
          placeholder: "✍️ Digite aqui",
          style: TextInputStyle.Short,
        },
      }),
    });
  },
});
