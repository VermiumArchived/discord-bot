module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const { client, user, guild, commandName } = interaction;
    const { commands } = client;
    const command = await commands.get(commandName);

    if (!command) return;

    try {
      if (user.id == 541981081419776002) {
        await command.execute(interaction);
      } else {
        console.log('NOT OWNER');
      }
    } catch (error) {
      console.error(error);
      return interaction.reply({
        content: `There was an error while executing this command!\n${error}`,
        ephemeral: true,
      });
    }
  },
};
