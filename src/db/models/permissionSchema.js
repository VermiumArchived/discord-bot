const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    guild: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    role: {
      type: mongoose.SchemaTypes.String,
      required: true,
      index: false,
    },
    command: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: false,
      index: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('permission', permissionSchema, 'permission');
