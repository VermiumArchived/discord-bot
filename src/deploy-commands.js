const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, zynerId, token } = require('./config.json');
const permission = require('./db/models/permissionSchema');
const commands = [];
const commandFolders = fs.readdirSync('./src/commands');

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./src/commands/${folder}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => console.log('Successfully registered guild application commands.'))
  .catch(console.error);

rest
  .put(Routes.applicationGuildCommands(clientId, zynerId), { body: commands })
  .then(() => console.log('Successfully registered guild application commands.'))
  .catch(console.error);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);