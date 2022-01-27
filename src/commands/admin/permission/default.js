const permission = require('../../../db/models/permissionSchema');
const { error, success } = require('../../../handlers');

module.exports = async (interaction) => {
  const { guild } = interaction;
  let perms = [];
  const commandFolders = fs.readdirSync('./src/commands');

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/commands/${folder}`)
      .filter((file) => file.endsWith('.js'));
    for (const file of commandFiles) {
      const command = require(`../../commands/${folder}/${file}`);
      const commandData = command.data.toJSON();
      if (command.permission.default === true) {
        perms.push(commandData.name);
      }
    }
  }
  const defaultPermDB = await permission.findOne({ guildID: guild.id, roleID: guild.id });
  if (!defaultPermDB) {
    permission
      .create({ guildID: guild.id, roleID: guild.id, permissions: perms })
      .then(async () => {
        return success(interaction, {
          title: 'Default Permissions',
          description: `Successfully created default commands: ${perms.map((x) => x)}`,
          ephemeral: true,
          thumbnail: true,
        });
      });
  } else {
    permission
      .updateOne({ guildID: guild.id, roleID: guild.id }, { permissions: perms })
      .then(async () => {
        return success(interaction, {
          color: 0x99cc99,
          title: 'Default Permissions',
          description: `Successfully configured commands: ${perms.map((x) => x)}`,
          ephemeral: true,
          thumbnail: true,
        });
      });
  }
};
