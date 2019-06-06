import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';

const DEBUG = config.get('DEBUG');

const NODE_ENV = config.get('NODE_ENV');

const templatePathToDataModels = `${__dirname.replace(/\\/g, '/')}/../**/dataAccess/models/*DataModel{.ts,.js}`;

const POSTGRES_PORT = config.get('CONNECTIONS.POSTGRES.PORT');
const POSTGRES_HOST = config.get('CONNECTIONS.POSTGRES.HOST');
const POSTGRES_DB = config.get('CONNECTIONS.POSTGRES.DB');
const POSTGRES_USER = config.get('CONNECTIONS.POSTGRES.USER');
const POSTGRES_URL = config.get('CONNECTIONS.POSTGRES.URL');

const url = POSTGRES_URL || `postgres://${POSTGRES_USER}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            name: 'common',
            type: 'postgres',
            url: url,
            entities: [templatePathToDataModels],
            synchronize: false,
            logging: DEBUG ? ['query', 'error'] : [],
            extra: {
                max: 20,
                min: 1,
                ssl: NODE_ENV !== 'debug'
            }
        })
    ]
})

export class DbModule {}
