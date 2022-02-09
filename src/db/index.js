const mongoose = require('mongoose');

const { mongodb } = require('../config.json');

const { connectionString } = mongodb;
const logger = require('../logger');

module.exports = {
  async connect() {
    try {
      await mongoose.connect(connectionString);
      logger.info('Connected to the database');
    } catch (e) {
      logger.error(e);
    }
  },
};
