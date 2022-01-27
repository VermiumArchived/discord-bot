const { MessageEmbed } = require('discord.js');

module.exports = async (interaction, embed, ephemeral) => {
  interaction.reply({ embeds: [embed], ephemeral });
};
