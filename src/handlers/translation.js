const i18next = require('i18next');

module.exports = async () => {
  await i18next.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: true,
    fallbackLng: 'en',
    resources: {
      en: {
        ready: { message: 'Ready! Logged in as {{client.user.tag}}!' },
        db: {
          connected: 'Connected to the database!',
        },
        deployCommands: {
          global: 'Successfully registered application commands.',
          guild: 'Successfully registered guild application commands.',
        },
      },
      sv: {
        ready: { message: 'Redo! Inloggad som {{client.user.tag}}!' },
        db: {
          connected: 'Ansluten till databasen!',
        },
        deployCommands: {
          global: 'Registrerade programkommandon.',
          guild: 'Registrerade guild-applikationskommandon.',
        },
      },
    },
  });
};
