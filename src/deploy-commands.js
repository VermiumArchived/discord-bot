const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('./handlers/translation')();

const i18next = require('i18next');
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
  .then(() => logger.info(i18next.t('deployCommands:guild')))
  .catch(logger.error);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => logger.info(i18next.t('deployCommands:global')))
  .catch(logger.error);
