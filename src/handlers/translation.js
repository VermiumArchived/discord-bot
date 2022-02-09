const i18next = require('i18next');

module.exports = async () => {
  await i18next.init({
    lng: 'sv_SE', // if you're using a language detector, do not define the lng option
    // debug: true,
    fallbackLng: 'en_US',
    resources: {
      en_US: {
        ready: { message: 'Ready! Logged in as {{client.user.tag}}!' },
        db: {
          connected: 'Connected to the database!',
        },
        debug: {
          interactionCreate: {
            commandExecuted:
              'Command {{commandName}} got executed by {{user.username}}#{{user.discriminator}}.',
          },
        },
        deployCommands: {
          global: 'Successfully registered application commands.',
          guild: 'Successfully registered guild application commands.',
        },
        misc: { servers: { inviteCode: 'Invite Code', totalMembers: 'Total Members' } },
      },
      sv_SE: {
        ready: { message: 'Redo! Inloggad som {{client.user.tag}}!' },
        db: {
          connected: 'Ansluten till databasen!',
        },
        deployCommands: {
          global: 'Registrerade programkommandon.',
          guild: 'Registrerade guild-applikationskommandon.',
        },
        misc: { servers: { inviteCode: 'Inbjudningskod', totalMembers: 'Antal medlemmar' } },
        debug: {
          interactionCreate: {
            commandExecuted:
              'Kommandot {{commandName}} kördes nyss av {{user.username}}#{{user.discriminator}}.',
          },
        },
      },
    },
  });
};
