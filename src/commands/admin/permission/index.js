const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const permission = require('../../../db/models/permissionSchema');
const fs = require('fs');
const { error, success } = require('../../../handlers');
const permissionAdd = require('./add');
const permissionDefault = require('./default');

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
      subcommand.setName('default').setDescription('Add default permission')
    ),
  async execute(interaction) {
    if (interaction.inGuild() == true) {
      switch (interaction.options.getSubcommand()) {
        case 'add':
          permissionAdd(interaction);
        case 'remove':
          permissionRemove(interaction);
        case 'list':
          permissionList(interaction);
        case 'default':
          permissionDefault(interaction);
      }
    }
  },
};
