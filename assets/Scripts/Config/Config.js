const environment_enum = require('Environment_Enum');
const Config_Dev = require('Config.Dev');
const Config_Prod = require('Config.Prod');

// const ENVIRONMENT = environment_enum.DEVELOPMENT; // quá trình phát triển thì dùng cái này 
const ENVIRONMENT = environment_enum.PRODUCTION;  // quá trình đã lên sản phẩm thì dùng cái này

const Config = (ENVIRONMENT == environment_enum.PRODUCTION) ? Config_Prod : Config_Dev;

module.exports = Config;
