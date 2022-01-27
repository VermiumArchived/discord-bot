const fs = require('fs');
const permission = require('../db/models/permissionSchema');

module.exports = {
  name: 'guildCreate',
  async execute(guild) {
    let perms = [];
    const commandFolders = fs.readdirSync('./src/commands');

    for (const folder of commandFolders) {
      const commandFiles = fs
        .readdirSync(`./src/commands/${folder}`)
        .filter((file) => file.endsWith('.js'));
      for (const file of commandFiles) {
        const command = require(`../commands/${folder}/${file}`);
        const commandData = command.data.toJSON();
        if (command.permission.default === true) {
          perms.push(commandData.name);
        }
      }
    }
    permission
      .create({ guildID: guild.id, roleID: guild.id, permissions: perms })
      .then(async () => {
        console.log('Created default', { guildID: guild.id, roleID: guild.id, permissions: perms });
      });
    console.log(perms);
  },
};
