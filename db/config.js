const config = require('config');

const POSTGRES_PORT = config.get('CONNECTIONS.POSTGRES.PORT');
const POSTGRES_HOST = config.get('CONNECTIONS.POSTGRES.HOST');
const POSTGRES_DB = config.get('CONNECTIONS.POSTGRES.DB');
const POSTGRES_USER = config.get('CONNECTIONS.POSTGRES.USER');
const POSTGRES_URL = config.get('CONNECTIONS.POSTGRES.URL');

const url = POSTGRES_URL || `postgres://${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

module.exports = {
    defaultEnv: { ENV: 'NODE_ENV' },
    debug: {
        driver: 'pg',
        url: url,
        schema: 'public'
    },
    develop: {
        driver: 'pg',
        url: url,
        schema: 'public',
        addIfNotExists: {
            sslmode: 'require'
        },
        overwrite: {
            native: true
        }
    },
    deploy: {
        driver: 'pg',
        url: url,
        schema: 'public',
        addIfNotExists: {
            sslmode: 'require'
        },
        overwrite: {
            native: true
        }
    }
};
