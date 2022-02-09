const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');
const i18next = require('i18next');

module.exports = {
  permission: { default: true },
  guildOnly: false,
  botAdminOnly: false,
  data: new SlashCommandBuilder().setName('servers').setDescription('Small servers.'),
  async execute(interaction) {
    const { client } = interaction;
    const locale = interaction.guild.preferredLocale.replace(/-/, '_');
    const guilds = client.guilds.cache;

    const [small] = guilds.partition((x) => x.large);
    const [community] = small.partition((x) => x.features.includes('COMMUNITY'));

    const guild = community.random();

    if (!guild) {
      const bot = interaction.client.user;

      const embed = new MessageEmbed()
        .setColor('#f76363')
        .setTitle('No community guilds found!')
        .setDescription('Please try again later')
        .setFooter({ text: `${bot.username}`, iconURL: bot.displayAvatarURL() });
      interaction.reply({ embeds: [embed], ephemeral: true });
    }

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
            {
              name: i18next.t('misc:servers:inviteCode', { lng: locale }),
              value: `${invite.url}`,
              inline: true,
            },
            {
              name: i18next.t('misc:servers:totalMembers', { lng: locale }),
              value: `${guild.memberCount}`,
              inline: true,
            }
          )
          .setFooter({ text: `${bot.username}`, iconURL: bot.displayAvatarURL() });
        interaction.reply({ embeds: [embed], ephemeral: true });
      });
  },
};
