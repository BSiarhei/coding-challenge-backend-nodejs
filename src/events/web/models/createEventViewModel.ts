import { IsNotEmpty, MinLength, MaxLength, IsDate } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import { BikeTypesEnum } from '../../bikeTypesEnum';

import { CreateEventModel } from '../../application/models';

export class CreateEventViewModel {
    @Type(() => Date)
    @IsDate()
    @ApiModelProperty({ type: 'string', format: 'date-time' })
    public eventDate: Date;

    @MaxLength(512)
    @ApiModelProperty({ maxLength: 512 })
    public description: string;

    @IsNotEmpty()
    @MaxLength(12)
    @ApiModelProperty({ maxLength: 12 })
    public licenseNumber: string;

    @MaxLength(12)
    @ApiModelProperty({ maxLength: 12 })
    public color: string;

    @IsNotEmpty()
    @ApiModelProperty({ enum: Object.values(BikeTypesEnum), type: BikeTypesEnum })
    public type: BikeTypesEnum;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @ApiModelProperty({ minLength: 2, maxLength: 64 })
    public ownerFirstName: string;

    @IsNotEmpty()
    @MinLength(2)
    @MaxLength(50)
    @ApiModelProperty({ minLength: 2, maxLength: 64 })
    public ownerLastName: string;

    public getApplicationModel() {
        return new CreateEventModel(
            this.eventDate,
            this.description,
            this.licenseNumber,
            this.color,
            this.type,
            this.ownerFirstName,
            this.ownerLastName
        );
    }
}
