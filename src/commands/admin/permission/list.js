const permission = require('../../../db/models/permissionSchema');
const { error, success } = require('../../../handlers');

module.exports = async (interaction) => {
  const role = interaction.options.getRole('role');
  const guild = interaction.guild;
  const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
  if (roleDB) {
    return success(interaction, {
      color: 0x99cc99,
      title: `Permissions for ${role.name}:`,
      description: `${role} has permission to use${roleDB.permissions.map((x) => ` ${x}`)}.`,
      ephemeral: true,
      thumbnail: true,
    });
  } else {
    return error(interaction, {
      color: 0x99cc99,
      title: `Permissions not set for ${role.name}:`,
      description: `No permission set for ${role}.\nTo set a permission use /permission add [role] [command].`,
      ephemeral: true,
      thumbnail: true,
    });
  }
};
