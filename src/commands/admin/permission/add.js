const permission = require('../../../db/models/permissionSchema');
const { error, success } = require('../../../handlers');

module.exports = async (interaction) => {
  const role = interaction.options.getRole('role');
  const command = interaction.options.getString('command');
  const guild = interaction.guild;
  const clientCommands = guild.commands.client.commands;
  let commands = [];
  clientCommands.map((x) => commands.push(x.data.name));
  if (commands.includes(command)) {
    let permissions = [];
    permissions.push(command);
    const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
    if (!roleDB) {
      await permission
        .create({ guildID: guild.id, roleID: role.id, permissions })
        .then(async () => {
          return success(interaction, {
            title: 'Created Permissions',
            description: `Successfully created permission node for ${role} and added command: ${command} to the role.`,
            ephemeral: true,
          });
        });
    } else if (!roleDB.permissions.includes(command)) {
      await permission
        .findOneAndUpdate({ guildID: guild.id, roleID: role.id }, { $push: { permissions } })
        .then(async () => {
          return success(interaction, {
            title: 'Added Permissions',
            description: `Successfully added command: ${command} for ${role}.`,
            ephemeral: true,
          });
        });
    } else {
      return error(interaction, {
        title: 'Permission exists',
        description: `${command} already is allowed for ${role}`,
        ephemeral: true,
      });
    }
  } else {
    return error(interaction, {
      title: 'Add Permission',
      description: `${command} is not a valid command.`,
      ephemeral: true,
    });
  }
};
