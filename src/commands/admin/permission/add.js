module.exports = async () => {
  const role = interaction.options.getRole('role');
  const command = interaction.options.getString('command');
  const guild = interaction.guild;
  let permissions = [];
  permissions.push(command);
  const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
  if (!roleDB) {
    await permission.create({ guildID: guild.id, roleID: role.id, permissions }).then(async () => {
      return success(interaction, {
        title: 'Created Permissions',
        description: `Successfully created permission node for ${role} and added command: ${command} to the role.`,
        ephemeral: true,
        thumbnail: true,
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
          thumbnail: true,
        });
      });
  } else {
    return error(interaction, {
      title: 'Permission exists',
      description: `${command} already is allowed for ${role}`,
    });
  }
};
