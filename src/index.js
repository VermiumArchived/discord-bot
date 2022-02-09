const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const logger = require('./logger');

const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

require('./db').connect();

require('./handlers/translation')();

(async () => {
  client.commands = new Collection();

  fs.promises.readdir('./src/commands').then(async (category) => {
    fs.promises.readdir(`./src/commands/${category}`).then((command) => {
      /* eslint-disable-next-line global-require, import/no-dynamic-require */
      const cmd = require(`./commands/${category}/${command}`);
      client.commands.set(cmd.data.name, cmd);
    });
  });

  fs.promises
    .readdir('./src/events')
    .then(async (file) => {
      file.forEach(async (fileName) => {
        /* eslint-disable-next-line global-require, import/no-dynamic-require */
        const event = require(`./events/${fileName}`);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      });
    })
    .catch((e) => logger.error(e));

  await client.login(token);
})();
