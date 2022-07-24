import {AbstractSeedService} from '../../seed/service/abstract-seed.service';
import {FilterService} from '../../search/service/filter.service';
import {Garden} from '../model/garden';
import {HttpClient} from '@angular/common/http';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {Injectable} from '@angular/core';
import {MessageService} from '../../ui/message/service/message.service';
import {Router} from '@angular/router';
import {SeedType} from '../../seed/model/seed-type.enum';

@Injectable({providedIn: 'root'})
export class GardenService extends AbstractSeedService<Garden> {

    constructor(protected _http: HttpClient,
                protected _router: Router,
                protected _filterService: FilterService,
                protected _messageService: MessageService,
                protected _indicator: IndicatorService) {
        super(SeedType.GARDEN, _http, _router, _filterService, _messageService, _indicator);
    }
}
