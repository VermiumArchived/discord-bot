const { MessageEmbed } = require('discord.js');

module.exports = async (interaction, e) => {
  const bot = interaction.client.user;

  const { title, description } = e;

  const embed = new MessageEmbed()
    .setColor('#f76363')
    .setTitle(`${title}`)
    .setDescription(`${description}`)
    .setTimestamp()
    .addFields({ name: 'ID', value: `${interaction.id}`, inline: true })
    .setFooter({ text: `${bot.username}`, iconURL: bot.displayAvatarURL() });
  interaction.reply({ embeds: [embed], ephemeral: true });
  // console.log('Interaction Error:', error, user, interaction, permission);
};
