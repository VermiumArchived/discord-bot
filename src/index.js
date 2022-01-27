const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');

const { token } = require('./config.json');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS] });

const db = require('./db');

db.connectDB();
(async () => {
  client.commands = new Collection();

  const commandFolders = fs.readdirSync('./src/commands');

  for (const folderOne of commandFolders) {
    const folders = fs.readdirSync(`./src/commands/${folderOne}`);

    for (const folder of folders) {
      const command = require(`./commands/${folderOne}/${folder}/index.js`);
      client.commands.set(command.data.name, command);
      // const commandFiles = fs
      //   .readdirSync(`./src/commands/${folderOne}/${folder}`)
      //   .filter((file) => file.endsWith('.js'));
      // for (const file of commandFiles) {
      //   const command = require(`./commands/${folder}/${file}`);
      //   client.commands.set(command.data.name, command);
      // }
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
