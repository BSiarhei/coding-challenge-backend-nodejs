const config = require('config');

const POSTGRES_PORT = config.get('CONNECTIONS.POSTGRES.PORT');
const POSTGRES_HOST = config.get('CONNECTIONS.POSTGRES.HOST');
const POSTGRES_DB = config.get('CONNECTIONS.POSTGRES.DB');
const POSTGRES_USER = config.get('CONNECTIONS.POSTGRES.USER');
const POSTGRES_URL = config.get('CONNECTIONS.POSTGRES.URL');

const url = POSTGRES_URL || `postgres://${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

module.exports = {
    'defaultEnv': 'debug',
    'debug': url
};
