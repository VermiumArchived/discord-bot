const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const permission = require('../../db/models/permissionSchema');
const fs = require('fs');
const { error, success } = require('../../handlers');

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
    if (interaction.options.getSubcommand() === 'add' && interaction.inGuild() == true) {
      const role = interaction.options.getRole('role');
      const command = interaction.options.getString('command');
      const guild = interaction.guild;
      let permissions = [];
      permissions.push(command);
      const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
      if (!roleDB) {
        await permission
          .create({ guildID: guild.id, roleID: role.id, permissions })
          .then(async () => {
            return success(interaction, {
              title: 'Created Permissions',
              description: `Successfully created permission node for ${role} and added command: ${command} to the role.`,
              ephemeral: false,
              thumbnail: true,
            });
          });
      } else if (!roleDB.permissions.includes(command)) {
        await permission
          .findOneAndUpdate({ guildID: guild.id, roleID: role.id }, { $push: { permissions } })
          .then(async () => {
            return success(interaction, {
              title: 'Added Permissions',
              description: `Successfully added command: ${command} for ${role}.`,
              ephemeral: true,
              thumbnail: true,
            });
          });
      } else {
        return error(interaction, {
          title: 'Permission exists',
          description: `${command} already is allowed for ${role}`,
        });
      }
    } else if (interaction.options.getSubcommand() === 'default' && interaction.inGuild() == true) {
      const { guild } = interaction;
      let perms = [];
      const commandFolders = fs.readdirSync('./src/commands');

      for (const folder of commandFolders) {
        const commandFiles = fs
          .readdirSync(`./src/commands/${folder}`)
          .filter((file) => file.endsWith('.js'));
        for (const file of commandFiles) {
          const command = require(`../../commands/${folder}/${file}`);
          const commandData = command.data.toJSON();
          if (command.permission.default === true) {
            perms.push(commandData.name);
          }
        }
      }
      const defaultPermDB = await permission.findOne({ guildID: guild.id, roleID: guild.id });
      if (!defaultPermDB) {
        permission
          .create({ guildID: guild.id, roleID: guild.id, permissions: perms })
          .then(async () => {
            return success(interaction, {
              title: 'Default Permissions',
              description: `Successfully created default commands: ${perms.map((x) => x)}`,
              ephemeral: true,
              thumbnail: true,
            });
          });
      } else {
        permission
          .updateOne({ guildID: guild.id, roleID: guild.id }, { permissions: perms })
          .then(async () => {
            return success(interaction, {
              color: 0x99cc99,
              title: 'Default Permissions',
              description: `Successfully configured commands: ${perms.map((x) => x)}`,
              ephemeral: true,
              thumbnail: true,
            });
          });
      }
    } else if (interaction.options.getSubcommand() === 'remove' && interaction.inGuild() == true) {
      const role = interaction.options.getRole('role');
      const command = interaction.options.getString('command');
      const guild = interaction.guild;
      let permissions = [];
      permissions.push(command);
      const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
      if (roleDB) {
        await permission
          .findOneAndUpdate(
            { guildID: guild.id, roleID: role.id },
            { $pull: { permissions: command } }
          )
          .then(async () => {
            return success(interaction, {
              color: 0x99cc99,
              title: 'Removed Permission',
              description: `Successfully removed permission to execute command: ${command} for ${role}.`,
              ephemeral: true,
              thumbnail: true,
            });
          });
      } else {
        return error(interaction, {
          color: 0x99cc99,
          title: 'Removed Permission',
          description: `${role} has no permission to execute:\n${command}`,
          ephemeral: true,
          thumbnail: true,
        });
      }
    } else if (interaction.options.getSubcommand() === 'list' && interaction.inGuild() == true) {
      const role = interaction.options.getRole('role');
      const guild = interaction.guild;
      const roleDB = await permission.findOne({ guildID: guild.id, roleID: role.id });
      if (roleDB) {
        return success(interaction, {
          color: 0x99cc99,
          title: 'Removed Permission',
          description: `${role} has permission to execute:\n${roleDB.permissions.map((x) => x)}`,
          ephemeral: true,
          thumbnail: true,
        });
      } else {
        interaction,
          {
            color: 0x99cc99,
            title: 'Role Permission',
            description: `${role} has no permissions`,
            ephemeral: true,
            thumbnail: true,
          };
      }
    }
  },
};
