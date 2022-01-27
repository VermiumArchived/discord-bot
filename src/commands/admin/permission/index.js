const { SlashCommandBuilder } = require('@discordjs/builders');
const permission = require('../../../db/models/permissionSchema');
const fs = require('fs');
const permissionAdd = require('./add');
const permissionDefault = require('./default');
const permissionRemove = require('./remove');
const permissionList = require('./list');

module.exports = {
  permission: { default: false },
  guildOnly: true,
  botAdminOnly: false,
  data: new SlashCommandBuilder()
    .setName('permission')
    .setDescription('Configure guild permissions')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Add permission')
        .addRoleOption((option) =>
          option.setName('role').setDescription('RoleID').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('command').setDescription('Command').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Remove permission')
        .addRoleOption((option) =>
          option.setName('role').setDescription('RoleID').setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('command').setDescription('Command').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('list')
        .setDescription('List role permission')
        .addRoleOption((option) =>
          option.setName('role').setDescription('RoleID').setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('default')
        .setDescription('Add default permission')
        .addRoleOption((option) => option.setName('role').setDescription('RoleID'))
    ),
  async execute(interaction) {
    if (interaction.inGuild() == true) {
      if (interaction.options.getSubcommand() === 'add') {
        permissionAdd(interaction);
      } else if (interaction.options.getSubcommand() === 'remove') {
        permissionRemove(interaction);
      } else if (interaction.options.getSubcommand() === 'list') {
        permissionList(interaction);
      } else if (interaction.options.getSubcommand() === 'default') {
        permissionDefault(interaction);
      }
    }
  },
};
