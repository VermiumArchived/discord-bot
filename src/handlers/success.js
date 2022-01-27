const { MessageEmbed } = require('discord.js');

module.exports = async (interaction, e) => {
  const { guild, client } = interaction;
  const bot = client.user;

  const { title, description, ephemeral } = e;

  const embed = new MessageEmbed()
    .setColor('#99cc99')
    .setTitle(`${title}`)
    .setDescription(`${description}`)
    .setThumbnail(guild.iconURL())
    .setTimestamp()
    .setFooter({ text: `${bot.username}`, iconURL: bot.displayAvatarURL() });
  interaction.reply({ embeds: [embed], ephemeral });
};
