const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Permissions } = require('discord.js');

module.exports = {
  permission: { default: false },
  guildOnly: true,
  botAdminOnly: false,
  data: new SlashCommandBuilder()
    .setName('prune')
    .setDescription('Prune up to 99 messages.')
    .addIntegerOption((option) =>
      option.setName('amount').setDescription('Number of messages to prune')
    ),
  async execute(interaction) {
    const amount = await interaction.options.getInteger('amount');

    if (amount < 1 || amount > 100) {
      return await interaction.reply({
        content: 'You need to input a number between 1 and 99.',
        ephemeral: true,
      });
    }
    await interaction.channel.bulkDelete(amount, true).catch(async (error) => {
      console.error(error);
      await interaction.reply({
        content: 'There was an error trying to prune messages in this channel!',
        ephemeral: true,
      });
    });

    return interaction.reply({
      content: `Successfully pruned \`${amount}\` messages.`,
      ephemeral: true,
    });
  },
};
