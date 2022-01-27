const { MessageEmbed } = require('discord.js');
const error = require('../db/models/errorSchema');
module.exports = async (interaction, embed, ephemeral) => {
  const { user } = interaction;

  const interactionJSON = interaction.toJSON();
  await error
    .create({ command: interaction, interaction: interactionJSON })
    .then(async (response) => {
      const template = {
        color: 0xf76363,
        footer: {
          text: `${user.username}︱ ID: ${response._id}${embed.footer}`,
          icon_url: user.displayAvatarURL(),
        },
      };
      embed = { ...embed, ...template };

      interaction.reply({ embeds: [embed], ephemeral: embed.ephemeral || false });
    });
};
