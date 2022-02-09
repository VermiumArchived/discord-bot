/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('./handlers/translation')();

const i18next = require('i18next');
const { clientId, guildId, token } = require('./config.json');
const logger = require('./logger');

const commands = [];

const categoryFolders = fs.readdirSync('./src/commands');

for (const category of categoryFolders) {
  const commandFiles = fs
    .readdirSync(`./src/commands/${category}`)
    .filter((file) => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./commands/${category}/${file}`);
    commands.push(command.data.toJSON());
  }
}

const rest = new REST({ version: '9' }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
  .then(() => logger.info(i18next.t('deployCommands:guild')))
  .catch(logger.error);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => logger.info(i18next.t('deployCommands:global')))
  .catch(logger.error);
