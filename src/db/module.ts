import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'config';

const POSTGRES_PORT = config.get('CONNECTIONS.POSTGRES.PORT');
const POSTGRES_HOST = config.get('CONNECTIONS.POSTGRES.HOST');
const POSTGRES_DB = config.get('CONNECTIONS.POSTGRES.DB');
const POSTGRES_USER = config.get('CONNECTIONS.POSTGRES.USER');
const DEBUG = config.get('DEBUG');

const templatePathToDataModels = `${__dirname.replace(/\\/g, '/')}/../**/dataAccess/models/*DataModel{.ts,.js}`;

@Module({
    imports: [
        TypeOrmModule.forRoot({
            name: 'common',
            type: 'postgres',
            host: POSTGRES_HOST,
            port: POSTGRES_PORT,
            username: POSTGRES_USER,
            database: POSTGRES_DB,
            entities: [templatePathToDataModels],
            synchronize: false,
            logging: DEBUG ? ['query', 'error'] : [],
            extra: { max: 20, min: 1 }
        })
    ]
})

export class DbModule {}
