const { MessageEmbed } = require('discord.js');
const success = require('../db/models/successSchema');

module.exports = async (interaction, embed, ephemeral) => {
  const { user } = interaction;
  const interactionJSON = interaction.toJSON();
  await success
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
        color: 0x99cc99,
        footer: {
          text: footer(embed.footer),
          icon_url: user.displayAvatarURL(),
        },
      };
      embed = { ...embed, ...template };
      interaction.reply({ embeds: [embed], ephemeral: embed.ephemeral || false });
    });
};
