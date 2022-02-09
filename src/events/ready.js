const i18next = require('i18next');
const logger = require('../logger');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    logger.info(i18next.t('common:ready', { client }));
  },
};
