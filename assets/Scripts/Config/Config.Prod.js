const environment_enum = require('Environment_Enum');

module.exports = {
    ENVIRONMENT: environment_enum.PRODUCTION,
    WEBSOCKET: {
        APP: {
            IS_SSL: true,
            URL: "signal.xokvip.net/app"
        },
        DEALER: {
            IS_SSL: true,
            URL: "signal.xokvip.net/dealer"
        }
    },
    SERVER_API: "https://signal.xokvip.net",
};
