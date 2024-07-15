import { Responder, ResponderType } from "#base";

import { createEmbed } from "@magicyan/discord";
import { settings } from "#settings";

new Responder({
  customId: "ticket/rename/input",
  type: ResponderType.ModalComponent,
  cache: "cached",
  async run(interaction) {
    if (!interaction.channel) return;
    const oldName = interaction.channel.name;
    const newName = `📨・${interaction.fields.getTextInputValue("name")}`;
    interaction.channel.setName(newName);
    const embed = createEmbed({
      color: settings.colors.warning,
      description: `### \`⚠️\` Renomeado\n> Este canal foi renomeado por: ${interaction.user}\n\`\`\`Nome antigo: ${oldName}\nNome atual: ${newName}\`\`\``,
      timestamp: new Date(),
    });
    interaction.channel.send({
      embeds: [embed],
    });
    return await interaction.deferUpdate();
  },
});
