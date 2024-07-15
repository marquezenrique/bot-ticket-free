import {
  ButtonBuilder,
  ButtonStyle,
  GuildMember,
  ModalMessageModalSubmitInteraction,
  TextChannel,
} from "discord.js";
import { Responder, ResponderType } from "#base";
import { createEmbed, createRow } from "@magicyan/discord";

import { res } from "lib/responses.js";
import { settings } from "#settings";

new Responder({
  customId: "ticket/members/input/:action",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction, { action }) {
    const addedId = interaction.fields.getTextInputValue("id");
    const member = interaction.guild.members.cache.find(
      (m) => m.id === addedId
    );

    if (!member) {
      return interaction.reply(
        res.danger(`❌\`\` Membro não encontrado com o ID: \`${addedId}\``)
      );
    }

    const channel = interaction.channel as TextChannel;

    switch (action) {
      case "add":
        await handleAddMember(channel, interaction, member, addedId);

      case "remove":
        await handleRemoveMember(channel, interaction, member, addedId);
        break;
    }
    return interaction.deferUpdate();
  },
});

async function handleAddMember(
  channel: TextChannel,
  interaction: ModalMessageModalSubmitInteraction<"cached">,
  member: GuildMember,
  addedId: string
) {
  await channel.permissionOverwrites.edit(addedId, {
    ViewChannel: true,
    SendMessages: true,
    AddReactions: true,
    AttachFiles: true,
    EmbedLinks: true,
    ReadMessageHistory: true,
  });

  const embedDM = createEmbed({
    color: settings.colors.warning,
    description: `### \`⚠️\` Aviso\n> Você foi adicionado em um ticket em \`${interaction.guild?.name}\`! Clique no botão abaixo para ser redirecionado ao canal.`,
  });

  const actionDM = createRow(
    new ButtonBuilder({
      url: `https://discord.com/channels/${interaction.guildId}/${interaction.channel?.id}`,
      label: "Acessar",
      style: ButtonStyle.Link,
    })
  );

  await member.send({ embeds: [embedDM], components: [actionDM] });

  const embed = createEmbed({
    color: settings.colors.warning,
    description: `### \`⚠️\` Aviso\n> ${interaction.user} adicionou ${member} à este ticket!`,
    timestamp: new Date(),
  });

  await channel.send({ embeds: [embed] });
}

async function handleRemoveMember(
  channel: TextChannel,
  interaction: ModalMessageModalSubmitInteraction<"cached">,
  member: GuildMember,
  addedId: string
) {
  const permissions = channel.permissionOverwrites.cache;

  if (!permissions.find((p) => p.id === addedId)) {
    return interaction.reply(
      res.danger(`\`❌\` O membro ${member} *não possui* acesso à este ticket!`)
    );
  }

  await channel.permissionOverwrites.edit(addedId, {
    ViewChannel: false,
    SendMessages: false,
    AddReactions: false,
    AttachFiles: false,
    EmbedLinks: false,
    ReadMessageHistory: false,
  });

  const embed = createEmbed({
    color: settings.colors.warning,
    description: `### \`⚠️\` Aviso\n> ${interaction.user} removeu ${member} deste ticket!`,
    timestamp: new Date(),
  });

  return await channel.send({ embeds: [embed] });
}
