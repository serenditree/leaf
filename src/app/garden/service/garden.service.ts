import {AbstractSeedService} from '../../seed/service/abstract-seed.service';
import {FilterService} from '../../search/service/filter.service';
import {Garden} from '../model/garden';
import {HttpClient} from '@angular/common/http';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {Injectable, inject} from '@angular/core';
import {MessageService} from '../../ui/message/service/message.service';
import {Router} from '@angular/router';
import {SeedType} from '../../seed/model/seed-type.enum';

@Injectable({providedIn: 'root'})
export class GardenService extends AbstractSeedService<Garden> {
    protected _http: HttpClient;
    protected _router: Router;
    protected _filterService: FilterService;
    protected _messageService: MessageService;
    protected _indicator: IndicatorService;

    constructor() {
        const _http = inject(HttpClient);
        const _router = inject(Router);
        const _filterService = inject(FilterService);
        const _messageService = inject(MessageService);
        const _indicator = inject(IndicatorService);

        super(SeedType.GARDEN, _http, _router, _filterService, _messageService, _indicator);

        this._http = _http;
        this._router = _router;
        this._filterService = _filterService;
        this._messageService = _messageService;
        this._indicator = _indicator;
    }
}
