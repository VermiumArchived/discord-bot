const permission = require('../../../db/models/permissionSchema');
const { error, success } = require('../../../handlers');

module.exports = async (interaction) => {
  const role = interaction.options.getRole('role');
  const command = interaction.options.getString('command');
  const guild = interaction.guild;
  let permissions = [];
  permissions.push(command);
  const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
  if (roleDB) {
    await permission
      .findOneAndUpdate({ guildID: guild.id, roleID: role.id }, { $pull: { permissions: command } })
      .then(async () => {
        return success(interaction, {
          color: 0x99cc99,
          title: 'Removed Permission',
          description: `Successfully removed permission to execute command: ${command} for ${role}.`,
          ephemeral: true,
          thumbnail: true,
        });
      });
  } else {
    return error(interaction, {
      color: 0x99cc99,
      title: 'Removed Permission',
      description: `${role} has no permission to execute:\n${command}`,
      ephemeral: true,
      thumbnail: true,
    });
  }
};
