const permission = require('../../../db/models/permissionSchema');
const { error, success } = require('../../../handlers');

module.exports = async (interaction) => {
  const role = interaction.options.getRole('role');
  const guild = interaction.guild;
  const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
  if (roleDB) {
    return success(interaction, {
      color: 0x99cc99,
      title: 'Removed Permission',
      description: `${role} has permission to execute:\n${roleDB.permissions.map((x) => x)}`,
      ephemeral: true,
      thumbnail: true,
    });
  } else {
    interaction,
      {
        color: 0x99cc99,
        title: 'Role Permission',
        description: `${role} has no permissions`,
        ephemeral: true,
        thumbnail: true,
      };
  }
};
