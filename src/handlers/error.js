const { MessageEmbed } = require('discord.js');
const error = require('../db/models/errorSchema');
module.exports = async (interaction, embed, ephemeral) => {
  const { user } = interaction;

  const interactionJSON = interaction.toJSON();
  await error
    .create({ command: interaction, interaction: interactionJSON })
    .then(async (response) => {
      const footer = (footer) => {
        if (footer) {
          return `${user.username}︱ ID: ${response._id}\n${footer}`;
        } else {
          return `${user.username}︱ ID: ${response._id}`;
        }
      };
      const template = {
        color: 0xf76363,
        footer: {
          text: footer(embed.footer),
          icon_url: user.displayAvatarURL(),
        },
      };
      embed = { ...embed, ...template };

      interaction.reply({ embeds: [embed], ephemeral: embed.ephemeral || false });
    });
};
