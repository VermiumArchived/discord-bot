const logger = require('../logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(`Ready! Logged in as ${client.user.tag}`);
  },
};
