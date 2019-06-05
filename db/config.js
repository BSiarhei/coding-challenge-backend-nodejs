const config = require('config');

const POSTGRES_PORT = config.get('CONNECTIONS.POSTGRES.PORT');
const POSTGRES_HOST = config.get('CONNECTIONS.POSTGRES.HOST');
const POSTGRES_DB = config.get('CONNECTIONS.POSTGRES.DB');
const POSTGRES_USER = config.get('CONNECTIONS.POSTGRES.USER');

module.exports = {
    'defaultEnv': 'debug',
    'debug': `postgres://${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`
};
