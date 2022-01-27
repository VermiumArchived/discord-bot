const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    roleID: {
      type: mongoose.SchemaTypes.String,
    },
    guildID: {
      type: mongoose.SchemaTypes.String,
    },
    permissions: {
      type: mongoose.SchemaTypes.Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('permission', permissionSchema, 'permission');
