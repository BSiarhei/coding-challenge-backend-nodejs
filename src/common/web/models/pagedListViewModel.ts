import { ApiModelProperty } from '@nestjs/swagger';

export class PagedListViewModel<T> {
    @ApiModelProperty({ isArray: true, type: Object })
    public items: T[];

    @ApiModelProperty({ minimum: 0 })
    public count: number;

    @ApiModelProperty({ minimum: 0 })
    public pageNumber: number;

    @ApiModelProperty({ minimum: 0 })
    public pageSize: number;

    constructor(
        count?: number,
        items?: T[],
        pageNumber?: number,
        pageSize?: number
    ) {
        this.count = count;
        this.items = items;
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }
}
