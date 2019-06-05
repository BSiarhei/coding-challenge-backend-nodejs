import { IsEnum, IsOptional } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

import { EventsFilterModel } from '../../application/models';

import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';
import { BikeTypesEnum } from '../../bikeTypesEnum';

export class EventsFilterViewModel {
    @IsEnum(EventStatusTypesEnum)
    @IsOptional()
    @ApiModelPropertyOptional({ enum: Object.values(EventStatusTypesEnum), type: EventStatusTypesEnum })
    public status: EventStatusTypesEnum;

    @IsEnum(BikeTypesEnum)
    @IsOptional()
    @ApiModelPropertyOptional(({ enum: Object.values(BikeTypesEnum), type: BikeTypesEnum }))
    public type: BikeTypesEnum;

    constructor(
        status?: EventStatusTypesEnum,
        type?: BikeTypesEnum
    ) {
        this.status = status;
        this.type = type;
    }

    public getApplicationModel() {
        return new EventsFilterModel(this.status, this.type);
    }
}
