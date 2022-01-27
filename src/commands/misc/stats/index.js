const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  permission: { default: true },
  guildOnly: false,
  botAdminOnly: false,
  data: new SlashCommandBuilder().setName('stats').setDescription('Statistics about the bot.'),
  async execute(interaction) {
    const client = interaction.client;
    const bot = interaction.client.user;
    const totalMembers = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);
    const sent = await interaction.reply({
      ephemeral: true,
      content: 'Pinging...',
      fetchReply: true,
    });
    const embed = new MessageEmbed()
      .setColor('#FFFFFF')
      .setTitle(`Statistics`)
      .addFields(
        {
          name: 'Invite link',
          value: 'https://bot.zyner.org',
          inline: true,
        },
        { name: 'Websocket heartbeat', value: `${interaction.client.ws.ping}ms.`, inline: true },
        {
          name: 'Roundtrip latency',
          value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`,
          inline: true,
        },
        { name: 'Total guilds', value: `${client.guilds.cache.size}`, inline: true },
        { name: 'Total members', value: `${totalMembers}`, inline: true }
      )
      .setThumbnail(bot.displayAvatarURL())
      .setDescription(`This bot is developed by Vermium with some help from jamme05
			`);
    await interaction.editReply({
      ephemeral: true,
      embeds: [embed],
    });
  },
};
