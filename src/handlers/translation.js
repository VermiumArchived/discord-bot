const i18next = require('i18next');

module.exports = () => {
  i18next.init({
    lng: 'en', // if you're using a language detector, do not define the lng option
    debug: true,
    resources: {
      en: {
        common: {
          ready: 'Ready! Logged in as {{client.user.tag}}!',
        },
      },
    },
  });
};
