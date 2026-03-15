import {AbstractSeedComponent} from '../../seed/seed/abstract-seed.component';
import {ActivatedRoute} from '@angular/router';
import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {GardenService} from '../service/garden.service';
import {Garden} from '../model/garden';
import {MapService} from '../../map/service/map.service';
import {MatDialog} from '@angular/material/dialog';
import {MessageService} from '../../ui/message/service/message.service';
import {SeedFilter} from '../../seed/model/seed-filter';
import {SeedService} from '../../seed/service/seed.service';
import {SeedType} from '../../seed/model/seed-type.enum';

@Component(
    {
        selector: 'st-garden',
        templateUrl: './garden.component.html',
        styleUrls: ['./garden.component.scss'],
        standalone: false
    }
)
export class GardenComponent extends AbstractSeedComponent<Garden> implements OnInit, OnDestroy {
    protected _route: ActivatedRoute;
    protected _mapService: MapService;
    protected _gardenService: GardenService;
    protected _fenceService: FenceService;
    protected _confirmDialog: MatDialog;
    protected _messageService: MessageService;
    private _childService = inject(SeedService);

    constructor() {
        const _route = inject(ActivatedRoute);
        const _mapService = inject(MapService);
        const _gardenService = inject(GardenService);
        const _fenceService = inject(FenceService);
        const _confirmDialog = inject(MatDialog);
        const _messageService = inject(MessageService);

        super(_route, _mapService, _gardenService, _fenceService, _confirmDialog, _messageService, SeedType.GARDEN);

        this._route = _route;
        this._mapService = _mapService;
        this._gardenService = _gardenService;
        this._fenceService = _fenceService;
        this._confirmDialog = _confirmDialog;
        this._messageService = _messageService;
    }

    get garden(): Garden {
        return this._seed;
    }

    get gardenState(): any {
        return {
            seed: this._seed,
            isGarden: true
        };
    }

    ngOnInit(): void {
        super._onInit();
    }

    ngOnDestroy(): void {
        super._onDestroy();
    }

    protected _onSeedResponse(garden: Garden): void {
        super._onSeedResponse(garden);
        const filter = new SeedFilter();
        filter.gardenId = garden.id;
        this._childService.retrieveByFilter(filter);
    }
}
