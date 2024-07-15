import { ButtonBuilder, ButtonStyle } from "discord.js";
import { Responder, ResponderType } from "#base";
import { createEmbed, createRow } from "@magicyan/discord";

import { db } from "#database";
import { genProtocol } from "#protocol";
import { res } from "#responses";
import { settings } from "#settings";

new Responder({
  customId: "ticket/create",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction) {
    const config = await db.config.get(interaction.guild.id);
    if (!config) {
      return interaction.reply(
        res.danger(
          "`❌` Este sistema não foi configurado corretamente. O dono do servidor consegue usar o comando `/config`"
        )
      );
    }
    const data: any = await db.ticket.getByUser(interaction.user.id);
    const channelExists = interaction.guild.channels.cache.find((c) => {
      if (data && data.guild === interaction.guild.id) {
        return c.type === 0 && c.topic === interaction.user.id;
      }
      return !data && c.type === 0 && c.topic === interaction.user.id;
    });
    if (!data) {
      if (channelExists) {
        await channelExists.delete();
      }
      return createTicket(interaction, config);
    }
    if (data.guild === interaction.guild.id) {
      if (channelExists) {
        return interaction.reply(
          res.danger(
            `\`❌\` Você já tem um ticket aberto! Acesse em: <#${data["channel"]}>`
          )
        );
      }
      await db.ticket.removeByUser(interaction.user.id);
      return interaction.reply(
        res.warning("`⚠️` Tivemos um *Erro interno*! Tente novamente.")
      );
    }
    return createTicket(interaction, config);
  },
});

const createTicket = async (interaction: any, config: any) => {
  const protocol = genProtocol().toLowerCase();
  const channel = await interaction.guild.channels.create({
    name: `📨・ticket-${protocol}`,
    type: 0,
    topic: interaction.user.id,
    parent: config.topic,
    permissionOverwrites: [
      {
        id: interaction.guild.roles.everyone,
        deny: ["SendMessages", "ViewChannel", "ReadMessageHistory"],
      },
      {
        id: interaction.user.id,
        allow: [
          "ViewChannel",
          "SendMessages",
          "AddReactions",
          "AttachFiles",
          "EmbedLinks",
          "ReadMessageHistory",
        ],
      },
      {
        id: config.role as string,
        allow: [
          "ViewChannel",
          "SendMessages",
          "AddReactions",
          "AttachFiles",
          "EmbedLinks",
          "ReadMessageHistory",
        ],
      },
    ],
  });
  interaction.reply(
    res.success(
      `\`✅\` ${interaction.user} Seu *ticket* de protocolo: \`${protocol}\` foi *aberto com sucesso*! Acesse em: <#${channel.id}>`
    )
  );
  await db.ticket.generate(
    protocol,
    channel.id,
    interaction.user.id,
    interaction.guild.id
  );
  const embed = createEmbed({
    color: settings.colors.default,
    author: {
      iconURL:
        interaction.guild.iconURL() ||
        "https://media.discordapp.net/attachments/1092976304871182347/1211092860284444792/Onesource4.png?ex=6695085e&is=6693b6de&hm=88cca0c9fc1d30a10ffef3aafb76e0145f5b0490114fc9e66fa6d2183079083c&=&format=webp&quality=lossless&width=671&height=671",
      name: `${interaction.guild.name} - Sistema de Atendimento 📑`,
      url: "http://1.1.1.1/",
    },
    description: `>>> 👤 **Aberto por:** *${interaction.user}* \n\`\`\`⚠️ Para tornar seu atendimento mais rápido, adiante o assunto.\n📃 Protocolo: ${protocol}\`\`\``,
  });
  const actions = createRow(
    new ButtonBuilder({
      customId: "ticket/close",
      emoji: "🗑️",
      label: "Fechar",
      style: ButtonStyle.Danger,
    }),
    new ButtonBuilder({
      customId: "ticket/rename",
      emoji: "✍️",
      label: "Renomear",
      style: ButtonStyle.Primary,
    }),
    new ButtonBuilder({
      customId: "ticket/poke",
      emoji: "🫵",
      label: "POKE",
      style: ButtonStyle.Primary,
    }),
    new ButtonBuilder({
      customId: "ticket/members/menu",
      emoji: "👥",
      label: "Membros",
      style: ButtonStyle.Success,
    })
  );
  await channel.send({
    content: `||${interaction.user}||`,
    embeds: [embed],
    components: [actions],
  });
};
