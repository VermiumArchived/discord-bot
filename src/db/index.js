const mongoose = require('mongoose');

const i18next = require('i18next');
const { mongodb } = require('../config.json');

const { connectionString } = mongodb;
const logger = require('../logger');

module.exports = {
  async connect() {
    try {
      await mongoose.connect(connectionString);
      logger.info(i18next.t('db:connected'));
    } catch (e) {
      logger.error(e);
    }
  },
};
