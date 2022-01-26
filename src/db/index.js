const mongoose = require('mongoose');

const { mongodb } = require('../config.json');
const { connectionString } = mongodb;

module.exports = {
  async connectDB() {
    try {
      await mongoose.connect(connectionString);
      console.log('Connected to the database');
    } catch (e) {
      console.log(e);
    }
  },
};
