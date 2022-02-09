const { SlashCommandBuilder } = require('@discordjs/builders');
const axios = require('axios');
const logger = require('../../logger');

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
      .then(async (res) => {
        // handle success
        const { client } = interaction;
        const response = res.data[0].data.children;
        const content = response[0].data;

        const { user } = client;

        const embed = {
          color: 0x99cc99,
          footer: {
            // eslint-disable-next-line no-underscore-dangle
            text: `${user.username}︱👍 ${content.ups}︱👎 ${content.downs}`,
            icon_url: user.displayAvatarURL(),
          },
          title: content.title,
          image: { url: content.url },
        };
        await interaction.reply({ embeds: [embed], ephemeral: false });
      })
      .catch((e) => {
        logger.error(e);
      });
  },
};
