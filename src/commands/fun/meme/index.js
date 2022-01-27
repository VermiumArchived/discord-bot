const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');
const { success, error } = require('../../../handlers');
module.exports = {
  permission: { default: true },
  guildOnly: false,
  botAdminOnly: false,
  category: 'fun',
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Send a random meme from reddit.com/r/memes.'),
  async execute(interaction) {
    const { client } = interaction.user;
    const { user } = client;
    await axios
      .get('https://www.reddit.com/r/memes/random/.json')
      .then(async function (res) {
        // handle success
        const response = res.data[0].data.children;
        const content = response[0].data;
        const embed = {
          color: 0x99cc99,
          title: content.title,
          image: {
            url: content.url,
          },
          timestamp: new Date(),
          footer: {
            text: `${user.username}︱👍 ${content.ups}︱👎 ${content.downs}`,
            icon_url: user.displayAvatarURL(),
          },
        };

        await interaction.reply({ embeds: [embed], ephemeral: false });
      })
      .catch(function (error) {
        console.log(error);
      });
  },
};
