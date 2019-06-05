import { IsNotEmpty, Min, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiModelProperty } from '@nestjs/swagger';

import { PagedParamsModel } from '../../application/models';

export class PagedParamsViewModel {
    @IsNotEmpty()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @ApiModelProperty({ default: 1, minimum: 1 })
    public pageNumber: number;

    @IsNotEmpty()
    @Min(1)
    @IsInt()
    @Type(() => Number)
    @ApiModelProperty({ default: 10, minimum: 1 })
    public pageSize: number;

    constructor(
        pageNumber: number  = 1,
        pageSize: number = 10
    ) {
        this.pageNumber = pageNumber;
        this.pageSize = pageSize;
    }

    public getApplicationModel() {
        return new PagedParamsModel(this.pageNumber, this.pageSize);
    }
}
