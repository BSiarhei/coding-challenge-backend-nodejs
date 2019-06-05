import { ApiModelProperty } from '@nestjs/swagger';

import { EventViewModel } from './eventViewModel';

export class EventPagedViewModel {
    @ApiModelProperty({ isArray: true, type: EventViewModel })
    public items: EventViewModel[];

    @ApiModelProperty({ minimum: 0 })
    public count: number;

    @ApiModelProperty({ minimum: 1 })
    public pageNumber: number;

    @ApiModelProperty({ minimum: 1 })
    public pageSize: number;
}
