const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions, Integration } = require('discord.js');

module.exports = {
  permission: { default: false },
  botAdminOnly: true,
  data: new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Send direct message to guild owners.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('owners')
        .setDescription('Send a DM to all guild owners')
        .addStringOption((option) =>
          option
            .setName('message')
            .setDescription('What message do you want to send?')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    if (interaction.options.getSubcommand() === 'owners') {
      const { client } = interaction.user;
      const { user } = client;
      const message = interaction.options.getString('message');
      const guilds = client.guilds.cache.map((guild) => guild);
      guilds.forEach(async (guild) => {
        const owner = await guild.fetchOwner();
        const embedOwner = new MessageEmbed()
          .setColor('#ffd27f')
          .setTitle(`From The Developers`)
          .setDescription(message)
          .setTimestamp()
          .setFooter({ text: `${guild.name}`, iconURL: user.displayAvatarURL() });
        await owner.send({ embeds: [embedOwner] });
      });
      const embedInteraction = new MessageEmbed()
        .setColor('#99cc99')
        .setTitle(`Successful`)
        .setTimestamp()
        .setDescription(`**Message**: ${message}`)
        .setFooter({ text: `${user.username}`, iconURL: user.displayAvatarURL() });
      await interaction.reply({ embeds: [embedInteraction], ephemeral: true });
    }
  },
};
