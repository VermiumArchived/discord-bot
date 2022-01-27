const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { success, error } = require('../../../handlers');

module.exports = {
  permission: { default: true },
  guildOnly: false,
  botAdminOnly: false,
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Send a random meme from r/memes.'),
  async execute(interaction) {
    await axios
      .get('https://www.reddit.com/r/memes/random/.json')
      .then(async function (res) {
        // handle success
        const response = res.data[0].data.children;
        const content = response[0].data;

        return success(interaction, {
          color: 0x99cc99,
          title: content.title,
          image: { url: content.url },
          footer: `👍 ${content.ups}︱👎 ${content.downs}`,
          ephemeral: false,
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
