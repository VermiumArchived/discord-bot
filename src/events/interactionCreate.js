const logger = require('../logger');
const permissions = require('../db/models/permissionSchema');
const { developerId } = require('../config.json');
const { error, success } = require('../handlers');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    const { client, user, guild, member, commandName } = interaction;
    const command = await client.commands.get(commandName);
    if (!interaction.isCommand() || !command) return;

    try {
      permissions.find({ guildID: guild.id, permissions: commandName }).then(async (result) => {
        /* eslint-disable-next-line no-underscore-dangle */
        member._roles.push(guild.id);
        /* eslint-disable-next-line no-underscore-dangle */
        const granted = result.some((x) => member._roles.includes(x.roleID));
        if (granted || user.id === guild.ownerId || user.id === developerId) {
          if (!interaction.inGuild() && command.guildOnly) {
            await error(interaction, {
              title: 'Permission Denied',
              description: 'This command is only allowed to be executed on the guild.',
              ephemeral: true,
            });
          } else if (user.id != developerId && command.botAdminOnly) {
            await error(interaction, {
              title: 'Permission Denied',
              description: 'This command is only allowed to be executed by bot admins.',
              ephemeral: true,
            });
          } else {
            await command.execute(interaction);
          }
        } else {
          await error(interaction, {
            title: 'Permission Denied',
            description: 'You do not have permission to perform this action.',
            ephemeral: true,
          });
        }
      });
    } catch (e) {
      await logger.error(e);
      await interaction.reply({
        content: `There was an error while executing this command!\n${error}`,
        ephemeral: true,
      });
    }
  },
};
