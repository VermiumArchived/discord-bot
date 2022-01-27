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
            console.log('Created', { guildID: guild.id, roleID: role.id });
            return success(interaction, {
              title: 'Created Permissions',
              description: `Successfully created permission node for ${role} and added command: ${command} to the role.`,
              ephemeral: false,
              thumbnail: true,
            });
          });
      } else {
        await permission
          .findOneAndUpdate({ guildID: guild.id, roleID: role.id }, { $push: { permissions } })
          .then(async () => {
            console.log('Updated', { guildID: guild.id, roleID: role.id });

            // return successHandler(interaction, {
            //   title: 'Updated Permissions',
            //   description: `Successfully added command: ${command} to role: ${role}`,
            //   ephemeral: false,
            //   thumbnail: true,
            // });
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
        console.log('Not Found');
        permission
          .create({ guildID: guild.id, roleID: guild.id, permissions: perms })
          .then(async () => {
            console.log('Created default', {
              guildID: guild.id,
              roleID: guild.id,
              permissions: perms,
            });
            // return successHandler(interaction, {
            //   title: 'Default Permission',
            //   description: 'Successfully created default permissions',
            //   ephemeral: true,
            //   thumbnail: true,
            // });
          });
      } else {
        console.log('Found');
        permission
          .findOneAndUpdate({ guildID: guild.id, roleID: guild.id }, { permissions: perms })
          .then(async () => {
            console.log('Updated default', {
              guildID: guild.id,
              roleID: guild.id,
              permissions: perms,
            });
            // return successHandler(interaction, {
            //   title: 'Default Permission',
            //   description: 'Successfully updated default permissions',
            //   ephemeral: true,
            //   thumbnail: true,
            // });
          });
      }
    }
  },
};
