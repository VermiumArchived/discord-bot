const permissions = require('../db/models/permissionSchema');
const { developerId } = require('../config.json');
module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const { client, user, guild, member, commandName } = interaction;
    const command = await client.commands.get(commandName);
    if (!interaction.isCommand() || !command) return;

    try {
      permissions.find({ guildID: guild.id, permissions: commandName }).then(async (result) => {
        member._roles.push(guild.id);
        const granted = result.some((x) => member._roles.includes(x.roleID));
        if (granted || user.id == guild.ownerId || user.id == developerId) {
          if (!interaction.inGuild() && command.guildOnly) {
            await interaction.reply({
              content: `Guild Only!`,
              ephemeral: true,
            });
          } else if (user.id != developerId && command.botAdminOnly) {
            await interaction.reply({
              content: `Bot Admin Only!`,
              ephemeral: true,
            });
          } else {
            await command.execute(interaction);
          }
        } else {
          await interaction.reply({ content: 'You do not have permission!', ephemeral: true });
        }
      });
    } catch (error) {
      console.error(error);
      return await interaction.reply({
        content: `There was an error while executing this command!\n${error}`,
        ephemeral: true,
      });
    }
  },
};
