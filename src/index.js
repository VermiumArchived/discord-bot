/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-restricted-syntax */
const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

require('./db').connect();

require('./handlers/translation')();

(async () => {
  client.commands = new Collection();

  const categoryFolders = fs.readdirSync('./src/commands');

  for (const category of categoryFolders) {
    const commandFiles = fs.readdirSync(`./src/commands/${category}`);

    for (const command of commandFiles) {
      const cmd = require(`./commands/${category}/${command}`);
      client.commands.set(cmd.data.name, cmd);
    }
  }

  const eventFiles = fs.readdirSync('./src/events').filter(async (file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  await client.login(token);
})();
