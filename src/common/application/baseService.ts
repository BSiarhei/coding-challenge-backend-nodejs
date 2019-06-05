import { Connection, QueryRunner } from 'typeorm';

export class BaseService {
    private readonly connection: Connection;

    constructor(
        connection: Connection
    ) {
        this.connection = connection;
    }

    protected async performWithTransaction(callback: (queryRunner: QueryRunner) => any): Promise<any> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.startTransaction();

        try {
            const result = await callback(queryRunner);

            await queryRunner.commitTransaction();

            return result;
        } catch (error) {
            await queryRunner.rollbackTransaction();

            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}
