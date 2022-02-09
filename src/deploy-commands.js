const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const logger = require('./logger');

const commands = [];

fs.promises.readdir('./src/commands').then(async (category) => {
  fs.promises.readdir(`./src/commands/${category}`).then((command) => {
    /* eslint-disable global-require, import/no-dynamic-require */
    const cmd = require(`./commands/${category}/${command}`);
    commands.push(cmd.data.toJSON());
  });
});

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => logger.info('Successfully registered guild application commands.'))
  .catch(logger.error);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => logger.info('Successfully registered application commands.'))
  .catch(logger.error);
