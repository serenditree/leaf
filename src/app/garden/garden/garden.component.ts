import {AbstractSeedComponent} from '../../seed/seed/abstract-seed.component';
import {ActivatedRoute} from '@angular/router';
import {Component} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {GardenService} from '../service/garden.service';
import {Garden} from '../model/garden';
import {MapService} from '../../map/service/map.service';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {MessageService} from '../../ui/message/service/message.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {SeedFilter} from '../../seed/model/seed-filter';
import {SeedService} from '../../seed/service/seed.service';
import {SeedType} from '../../seed/model/seed-type.enum';

@Component(
    {
        selector: 'st-garden',
        templateUrl: './garden.component.html',
        styleUrls: ['./garden.component.scss']
    }
)
export class GardenComponent extends AbstractSeedComponent<Garden> implements OnInit, OnDestroy {

    constructor(protected _route: ActivatedRoute,
                protected _mapService: MapService,
                protected _gardenService: GardenService,
                protected _fenceService: FenceService,
                protected _confirmDialog: MatDialog,
                protected _messageService: MessageService,
                private _childService: SeedService) {
        super(_route, _mapService, _gardenService, _fenceService, _confirmDialog, _messageService, SeedType.GARDEN);
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
        filter.parent = garden.id;
        this._childService.retrieveByFilter(filter);
    }
}
