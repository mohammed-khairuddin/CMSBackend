'use strict';

const env = {
  // PORT: process.env.PORT || 8082,
  // DATABASE_URL: process.env.DATABASE_URL || 'localhost',
  DATABASE_NAME: process.env.DATABASE_NAME || 'cm',
  DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
  DATABASE_USERNAME: process.env.DATABASE_USERNAME || 'root',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'root',
  // DATABASE_PORT: process.env.DATABASE_PORT || 5432,
  DATABASE_DIALECT: process.env.DATABASE_DIALECT || 'mysql',

  // NODE_ENV: process.env.NODE_ENV || 'development',
};

module.exports = env;