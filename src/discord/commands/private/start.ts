import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { createEmbed, createRow } from "@magicyan/discord";

import { Command } from "#base";
import { db } from "#database";
import { icon } from "lib/emojis.js";
import { res } from "lib/responses.js";
import { settings } from "#settings";

new Command({
  name: "start",
  description: "Iniciar sistema de ticket após sua configuração!",
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      name: "canal",
      description: "Canal que a mensagem de ticket será enviada.",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
    {
      name: "imagem",
      description: "[OPCIONAL] Imagem para mensagem de ticket.",
      type: ApplicationCommandOptionType.Attachment,
    },
    {
      name: "cor",
      description: "[OPCIONAL] Cor para mensagem de ticket (#rrggbb).",
      type: ApplicationCommandOptionType.String,
    },
  ],
  async run(interaction) {
    const { options } = interaction;
    const channel = options.getChannel("canal");

    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply(
        res.danger(
          "`❌` Apenas o dono do servidor consegue configurar o *Sistema de Tickets*"
        )
      );
    }

    const config = await db.config.get(interaction.guild.id);
    if (!config) {
      return interaction.reply(
        res.danger(
          `\`❌\` A configuração do *Sistema de Tickets* não foi encontrada para *\`${interaction.guild.name}\`*. Utilize o comando \`/config [categoria] [cargo] [logs]\` para prosseguir...`
        )
      );
    }

    if (!channel) return;

    if (channel.type != 0) {
      return interaction.reply(
        res.danger(
          "`❌` O canal em questão precisa ser do tipo: `Canal de Texto`"
        )
      );
    }

    const image = options.getAttachment("imagem");
    const files = ["png", "jpg", "gif", "webp"];
    let loadedImage;
    if (image) {
      const contentType = image.contentType?.toLowerCase();
      const isValidFileType = files.some((fileType) =>
        contentType?.includes(fileType)
      );
      if (!isValidFileType) {
        return interaction.reply(
          res.danger("`❌` O tipo de imagem enviado não é suportado!")
        );
      }
      loadedImage = image;
    }

    const color = options.getString("cor");
    let loadedColor;
    if (color) {
      const isValidColor = color.startsWith("#") && color.length === 7;
      if (!isValidColor) {
        return interaction.reply(
          res.danger(
            "`❌` O tipo de cor enviada não é suportado! Siga o modelo #rrggbb"
          )
        );
      }
      loadedColor = color;
    }

    const embed = createEmbed({
      color: loadedColor || settings.colors.default,
      author: {
        iconURL:
          interaction.guild.iconURL() ||
          "https://media.discordapp.net/attachments/1092976304871182347/1211092860284444792/Onesource4.png?ex=6695085e&is=6693b6de&hm=88cca0c9fc1d30a10ffef3aafb76e0145f5b0490114fc9e66fa6d2183079083c&=&format=webp&quality=lossless&width=671&height=671",
        name: `${interaction.guild.name} - Sistema de Atendimento 📑`,
        url: "http://1.1.1.1/",
      },
      description:
        "```📃 Para iniciar seu atendimento, clique no botão abaixo.``````⚠️ Abertura de tickets sem finalidade poderão levar à punições.``````👷 Não cobre para que um membro da equipe veja seu ticket em mensagens privadas, todos serão lidos.```",
      image: loadedImage ? (loadedImage as any).attachment : undefined,
    });

    const action = createRow(
      new ButtonBuilder({
        emoji: icon.ticketMessage,
        customId: "ticket/create",
        label: "Abrir Ticket",
        style: ButtonStyle.Secondary,
      })
    );

    (channel as any).send({ embeds: [embed], components: [action] });

    return interaction.reply(
      res.success(
        `\`✅\` A mensagem de ticket foi criada com sucesso em *${channel}*.`
      )
    );
  },
});
