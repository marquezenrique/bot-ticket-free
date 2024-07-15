import { ButtonBuilder, ButtonStyle, TextChannel } from "discord.js";
import { Responder, ResponderType } from "#base";
import { createEmbed, createRow } from "@magicyan/discord";

import { db } from "#database";
import { res } from "lib/responses.js";
import { settings } from "#settings";

new Responder({
  customId: "ticket/poke",
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

    if (!interaction.channel) return;

    const userId = (interaction.channel as TextChannel).topic as string;
    const user = interaction.guild.members.cache.get(userId);

    if (!user) return;

    const pokeEmbed = createEmbed({
      color: settings.colors.warning,
      description: `### \`🔔\` Aviso\n> Estão aguardando resposta em **seu ticket** em: *\`${interaction.guild.name}\`*. Acesse clicando no botão abaixo.`,
      timestamp: new Date(),
    });

    const actionRow = createRow(
      new ButtonBuilder({
        url: `https://discord.com/channels/${interaction.guild.id}/${interaction.channel.id}`,
        label: "Acessar",
        style: ButtonStyle.Link,
      })
    );

    await user.send({
      embeds: [pokeEmbed],
      components: [actionRow],
      content: `<@${user.id}>`,
      allowedMentions: {
        repliedUser: false,
      },
    });

    const confirmationEmbed = createEmbed({
      color: settings.colors.success,
      description: `### \`✅\` Notificado\n> O usuário ${user} foi notificado em sua DM`,
      timestamp: new Date(),
    });

    await interaction.channel.send({ embeds: [confirmationEmbed] });
    return await interaction.deferUpdate();
  },
});
