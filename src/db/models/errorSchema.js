const mongoose = require('mongoose');

const errorSchema = new mongoose.Schema(
  {
    command: { type: mongoose.SchemaTypes.String },
    interaction: {
      type: { type: mongoose.SchemaTypes.String },
      id: { type: mongoose.SchemaTypes.Number },
      applicationId: { type: mongoose.SchemaTypes.Number },
      channelId: { type: mongoose.SchemaTypes.Number },
      guildId: { type: mongoose.SchemaTypes.Number },
      user: { type: mongoose.SchemaTypes.Number },
      member: { type: mongoose.SchemaTypes.Number },
      version: { type: mongoose.SchemaTypes.Number },
      memberPermissions: { type: mongoose.SchemaTypes.String },
      locale: { type: mongoose.SchemaTypes.String },
      guildLocale: { type: mongoose.SchemaTypes.String },
      commandId: { type: mongoose.SchemaTypes.Number },
      commandName: { type: mongoose.SchemaTypes.String },
      deferred: { type: mongoose.SchemaTypes.Boolean },
      replied: { type: mongoose.SchemaTypes.Boolean },
      ephemeral: { type: mongoose.SchemaTypes.Boolean },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('error', errorSchema, 'error');
