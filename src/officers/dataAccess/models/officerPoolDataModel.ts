import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('officerpool')
export class OfficerPoolDataModel {
    @PrimaryColumn()
    officerPoolId: number;

    @Column({ type: 'integer', nullable: false })
    officerId: number;

    @CreateDateColumn({ type: 'timestamptz' })
    public createdAt: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    public updatedAt: Date;
}
