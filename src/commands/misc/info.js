const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  permission: { default: true },
  guildOnly: true,
  botAdminOnly: false,
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get info about a user or a server!')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('user')
        .setDescription('Info about a user')
        .addUserOption((option) =>
          option.setName('target').setDescription('The user').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName('server').setDescription('Info about the server')
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'user' && interaction.inGuild() == true) {
      const user = interaction.options.getUser('target');
      const { guild } = interaction;
      if (user) {
        const guildMember = guild.members.cache.get(user.id);
        const embed = new MessageEmbed()
          .setColor(user.accentColor)
          .setTitle(` ${user.username}`)
          .addFields(
            { name: ':ticket: ID', value: `${user.id}`, inline: true },
            {
              name: ':alien: Nickname',
              value: `${guildMember.nickname || 'No nickname'}`,
              inline: true,
            },
            {
              name: ':grey_question: Type',
              value: `${user.bot ? 'Bot' : `${user.system ? 'System' : 'Human'}`}`,
              inline: true,
            },
            { name: ':birthday: Created at', value: `${user.createdAt}`, inline: true },
            { name: ':partying_face: Joined at', value: `${guildMember.joinedAt}`, inline: true }
          )
          .setThumbnail(user.displayAvatarURL());
        await interaction.reply({
          ephemeral: true,
          embeds: [embed],
        });
      }
    } else if (interaction.options.getSubcommand() === 'server') {
      const { guild } = interaction;
      const embed = new MessageEmbed()
        .setColor(guild.large ? '#99cc99' : '#ffc0cb')
        .setTitle(` ${guild.name}`)
        .addFields(
          {
            name: 'Total Members',
            value: `${guild.memberCount}`,
            inline: true,
          },
          { name: 'ID', value: `${guild.id}`, inline: true },
          { name: 'Created at', value: `${guild.createdAt}`, inline: false }
        )
        .setThumbnail(guild.iconURL())
        .setDescription(guild.description || '');
      await interaction.reply({
        ephemeral: true,
        embeds: [embed],
      });
    }
  },
};
