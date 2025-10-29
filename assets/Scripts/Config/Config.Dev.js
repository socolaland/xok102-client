const environment_enum = require('Environment_Enum');

module.exports = {
    ENVIRONMENT: environment_enum.DEVELOPMENT,
    WEBSOCKET: {
        APP: {
            IS_SSL: false,
            // URL: "103.116.38.55:8009/app",
            URL: "localhost:8009/app"
        },
        DEALER: {
            IS_SSL: false,
            // URL: "103.116.38.55:8009/dealer",
            URL: "localhost:8009/dealer"
        }
    },
    // SERVER_API: "http://103.116.38.55:8009",
    SERVER_API: "http://localhost:8009",
};
