const { MessageEmbed } = require('discord.js');
const success = require('../db/models/successSchema');

module.exports = async (interaction, embed, ephemeral) => {
  const { user } = interaction;
  const interactionJSON = interaction.toJSON();
  await success
    .create({ command: interaction, interaction: interactionJSON })
    .then(async (response) => {
      const template = {
        color: 0x99cc99,
        footer: {
          text: `${user.username}︱ ID: ${response._id}`,
          icon_url: user.displayAvatarURL(),
        },
      };
      embed = { ...embed, ...template };
      interaction.reply({ embeds: [embed], ephemeral: embed.ephemeral || false });
    });
};
