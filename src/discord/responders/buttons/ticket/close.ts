import { Responder, ResponderType, Store } from "#base";

import { TextChannel } from "discord.js";
import { createEmbed } from "@magicyan/discord";
import { createTranscript } from "discord-html-transcripts";
import { db } from "#database";
import { settings } from "#settings";

const store = new Store();
const timeout = 15;

new Responder({
  customId: "ticket/close",
  type: ResponderType.Button,
  cache: "cached",
  async run(interaction) {
    const config: any = await db.config.get(interaction.guild.id);
    const { channel } = interaction;
    const logs = interaction.guild.channels.cache.find(
      (c) => c.id === config.logs
    );
    if (!logs) return;

    if (store.get(`${interaction.user.id}:${interaction.guildId}`)) return;

    const permissions = (interaction.channel as TextChannel)
      .permissionOverwrites.cache;
    permissions.forEach((pM) => {
      (interaction.channel as TextChannel).permissionOverwrites.edit(pM.id, {
        ViewChannel: true,
        SendMessages: false,
        AddReactions: false,
        AttachFiles: false,
        EmbedLinks: false,
        ReadMessageHistory: true,
      });
    });

    const date = new Date();
    store.set(`${interaction.user.id}:${interaction.guildId}`, true);

    const alertCloseEmbed = createEmbed({
      color: settings.colors.danger,
      description: `### \`❌\` Atendimento Finalizado \n> ${interaction.user} finalizou este ticket! Um registro de log foi salvo e este canal será apagado em ${timeout} segundos`,
      timestamp: new Date(),
    });

    if (!channel || channel.type != 0) return;

    const user = interaction.guild.members.cache.get(channel.topic as string);
    channel.send({ embeds: [alertCloseEmbed] });

    setTimeout(async () => {
      if (user) {
        const embedDM = createEmbed({
          color: settings.colors.danger,
          description:
            interaction.user.id == user.id
              ? `### \`❌\` Atendimento Finalizado \n> ${interaction.user} **finalizou** seu ticket em \`${interaction.guild.name}\`!`
              : `### \`❌\` Atendimento Finalizado \n> O seu ticket em \`${interaction.guild.name}\` foi **finalizado**!`,
          timestamp: new Date(),
        });
        await user.send({ embeds: [embedDM] });
        await db.ticket.removeByUser(user.id);
      }
      const logEmbed = createEmbed({
        description: "### `⚙️` Ticket Fechado",
        fields: [
          {
            name: "**`📅` Data**",
            value: `\`\`\`${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}\`\`\``,
            inline: true,
          },
          {
            name: "**`⏰` Hora**",
            value: `\`\`\`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}\`\`\``,
            inline: true,
          },
          {
            name: "**`🙍` Aberto por**",
            value: `${user} \`(@${user?.user.username})\``,
          },
          {
            name: "**`👷` Fechado por**",
            value: `${interaction.user} \`(@${interaction.user.tag})\``,
          },
        ],
      });

      const transcript = await createTranscript(channel as any);
      (logs as any).send({ embeds: [logEmbed], files: [transcript] });
      store.set(`${interaction.user.id}:${interaction.guildId}`, false);
      channel.delete();
    }, timeout * 1000);
    interaction.deferUpdate();
  },
});
