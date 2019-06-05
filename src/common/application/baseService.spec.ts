import { Connection, QueryRunner } from 'typeorm';

import { BaseService } from './baseService';

describe('BaseService', () => {
    let  queryRunner: QueryRunner;
    const connection = {
        createQueryRunner() {
            return queryRunner;
        }
    } as Connection;
    const baseService = new BaseService(connection);

    describe('performWithTransaction', () => {
        beforeEach(() => {
            queryRunner = {
                startTransaction() {},
                commitTransaction() {},
                rollbackTransaction() {},
                release() {}
            } as QueryRunner;
        });

        test('should commit transaction', async () => {
            const callback = (queryRunner) => {
                return Promise.resolve();
            };

            jest.spyOn(queryRunner, 'startTransaction').mockImplementation(() => Promise.resolve());
            jest.spyOn(queryRunner, 'commitTransaction').mockImplementation(() => Promise.resolve());
            jest.spyOn(queryRunner, 'release').mockImplementation(() => Promise.resolve());
            jest.spyOn(queryRunner, 'rollbackTransaction').mockImplementation(() => Promise.resolve());
            // @ts-ignore
            expect(await baseService.performWithTransaction(callback)).toBeUndefined();
            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.commitTransaction).toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
            expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
        });

        test('should rollback transaction', async () => {
            const error = new Error();

            const callback = (queryRunner) => {
                return Promise.reject(error);
            };

            jest.spyOn(queryRunner, 'startTransaction').mockImplementation(() => Promise.resolve());
            jest.spyOn(queryRunner, 'commitTransaction').mockImplementation(() => Promise.resolve());
            jest.spyOn(queryRunner, 'release').mockImplementation(() => Promise.resolve());
            jest.spyOn(queryRunner, 'rollbackTransaction').mockImplementation(() => Promise.resolve());

            try {
                // @ts-ignore
                await baseService.performWithTransaction(callback);
            } catch (error) {
                expect(error).toBe(error);
            }

            expect(queryRunner.startTransaction).toHaveBeenCalled();
            expect(queryRunner.commitTransaction).not.toHaveBeenCalled();
            expect(queryRunner.release).toHaveBeenCalled();
            expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
        });
    });
});
