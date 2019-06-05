import {
    Post,
    Put,
    Get,
    Controller,
    Body,
    Query,
    Param,
    HttpCode,
    ParseIntPipe,
    NotFoundException
} from '@nestjs/common';
import { ApiResponse, ApiUseTags } from '@nestjs/swagger';

import { NofFoundError, PagedListViewModel, PagedParamsViewModel } from '../../common';

import { EventService } from '../application';
import { EventModel } from '../application/models';
import { CreateEventViewModel, UpdateStatusViewModel, EventViewModel, EventsFilterViewModel, EventPagedViewModel } from './models';

@ApiUseTags('events')
@Controller('/events')
export class EventController {
    private readonly eventService: EventService;

    constructor(eventService: EventService) {
        this.eventService = eventService;
    }

    @Post()
    @HttpCode(201)
    @ApiResponse({ status: 201, description: 'Create an event.', type: EventViewModel })
    @ApiResponse({ status: 400, description: 'Unprocessable Entity' })
    async create(
        @Body() createEventViewModel: CreateEventViewModel
    ): Promise<EventViewModel> {
        const eventModel = await this.eventService.create(createEventViewModel.getApplicationModel());

        return EventViewModel.getViewModel(eventModel);
    }

    @Put(':id/status')
    @HttpCode(204)
    @ApiResponse({ status: 204, description: 'Update event status.' })
    @ApiResponse({ status: 400, description: 'Unprocessable Entity' })
    async updateStatus(
        @Param('id', new ParseIntPipe()) eventId: number,
        @Body() updateStatusViewModel: UpdateStatusViewModel
    ): Promise<void> {
        await this.eventService.updateStatus(eventId, updateStatusViewModel.status);
    }

    @Get()
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Get events.', type: EventPagedViewModel })
    @ApiResponse({ status: 400, description: 'Unprocessable Entity' })
    async find(
        @Query() eventsFilterViewModel: EventsFilterViewModel,
        @Query() pagedParamsViewModel: PagedParamsViewModel,
    ): Promise<PagedListViewModel<EventViewModel>> {
        const pagedParamsModel = pagedParamsViewModel.getApplicationModel();
        const eventsFilterModel = eventsFilterViewModel.getApplicationModel();

        const { events, count } = await this.eventService.find(pagedParamsModel, eventsFilterModel);

        return {
            count,
            pageNumber: pagedParamsViewModel.pageNumber,
            pageSize: pagedParamsViewModel.pageSize,
            items: events.map((event: EventModel) => EventViewModel.getViewModel(event))
        };
    }

    @Get(':id')
    @HttpCode(200)
    @ApiResponse({ status: 200, description: 'Get an event.', type: EventViewModel })
    @ApiResponse({ status: 404, description: 'Event was not found' })
    async findById(
        @Param('id', new ParseIntPipe()) eventId: number
    ): Promise<EventViewModel> {
        try {
            const eventModel = await this.eventService.findById(eventId);

            return EventViewModel.getViewModel(eventModel);
        } catch (error) {
            if (error instanceof NofFoundError) {
                throw new NotFoundException(error.message);
            }

            throw error;
        }
    }
}
