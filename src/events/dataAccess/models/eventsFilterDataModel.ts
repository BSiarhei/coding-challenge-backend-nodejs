import { EventStatusTypesEnum } from '../../eventStatusTypesEnum';
import { BikeTypesEnum } from '../../bikeTypesEnum';
import { EventsFilterModel } from '../../application/models';

export class EventsFilterDataModel {
    public status: EventStatusTypesEnum;
    public type: BikeTypesEnum;

    constructor(
        status?: EventStatusTypesEnum,
        type?: BikeTypesEnum
    ) {
        this.status = status;
        this.type = type;
    }

    public static getDataModel(eventsFilterModel: EventsFilterModel): EventsFilterDataModel {
        return new this(eventsFilterModel.status, eventsFilterModel.type);
    }
}
