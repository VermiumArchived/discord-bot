const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const { error, success } = require('../../handlers');

module.exports = {
  permission: { default: true },
  guildOnly: false,
  botAdminOnly: false,
  data: new SlashCommandBuilder().setName('servers').setDescription('Small servers.'),
  async execute(interaction) {
    const { client } = interaction;
    const guilds = client.guilds.cache;

    const [large, small] = guilds.partition((x) => x.large);
    const [community] = small.partition((x) => x.features.includes('COMMUNITY'));

    const guild = community.random();

    guild.channels.cache
      .get(guild.rulesChannelId)
      .createInvite()
      .then(async (invite) => {
        const bot = interaction.client.user;

        const embed = new MessageEmbed()
          .setColor('#99cc99')
          .setTitle(`${guild.name}`)
          .setDescription(`${guild.description || ''}`)
          .setThumbnail(guild.iconURL())
          .setTimestamp()
          .addFields(
            { name: 'Invite code', value: `${invite.url}`, inline: true },
            { name: 'Total members', value: `${guild.memberCount}`, inline: true }
          )
          .setFooter({ text: `${bot.username}`, iconURL: bot.displayAvatarURL() });
        interaction.reply({ embeds: [embed], ephemeral: true });
      });
  },
};
