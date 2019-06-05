import { ApiModelProperty } from '@nestjs/swagger';

import { OfficerViewModel } from '../../../officers/web/models';

import { BikeTypesEnum } from '../../bikeTypesEnum';
import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';
import { EventModel } from '../../application/models';

export class EventViewModel {
    @ApiModelProperty()
    public eventId: number;

    @ApiModelProperty({ enum: Object.values(EventStatusTypesEnum), type: EventStatusTypesEnum })
    public status: EventStatusTypesEnum;

    @ApiModelProperty({ type: 'string', format: 'date-time' })
    public eventDate: Date;

    @ApiModelProperty()
    public description: string | null;

    @ApiModelProperty()
    public licenseNumber: string;

    @ApiModelProperty()
    public color: string | null;

    @ApiModelProperty({ enum: Object.values(BikeTypesEnum), type: BikeTypesEnum })
    public type: BikeTypesEnum;

    @ApiModelProperty()
    public ownerFirstName: string;

    @ApiModelProperty()
    public ownerLastName: string;

    @ApiModelProperty({ type: OfficerViewModel, required: false })
    public officer?: OfficerViewModel | null;

    @ApiModelProperty({ type: 'string', format: 'date-time' })
    public createdAt: Date;

    @ApiModelProperty({ type: 'string', format: 'date-time' })
    public updatedAt: Date;

    constructor(
        eventId: number,
        status: EventStatusTypesEnum,
        eventDate: Date,
        description: string | null,
        licenseNumber: string,
        color: string | null,
        type: BikeTypesEnum,
        ownerFirstName: string,
        ownerLastName: string,
        officer: OfficerViewModel | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.eventId = eventId;
        this.status = status;
        this.eventDate = eventDate;
        this.description = description;
        this.licenseNumber = licenseNumber;
        this.color = color;
        this.type = type;
        this.ownerFirstName = ownerFirstName;
        this.ownerLastName = ownerLastName;
        this.officer = officer;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static getViewModel(eventModel: EventModel): EventViewModel {
        const officer = eventModel.officer && OfficerViewModel.getViewModel(eventModel.officer) || null;

        return new this(
            eventModel.eventId,
            eventModel.status,
            eventModel.eventDate,
            eventModel.description,
            eventModel.licenseNumber,
            eventModel.color,
            eventModel.type,
            eventModel.ownerFirstName,
            eventModel.ownerLastName,
            officer,
            eventModel.createdAt,
            eventModel.updatedAt
        );
    }
}
