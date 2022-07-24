import {AbstractList} from '../../../ui/list/list/abstract-list';
import {Component} from '@angular/core';
import {ElementRef} from '@angular/core';
import {GardenListItemComponent} from '../garden-list-item/garden-list-item.component';
import {GardenService} from '../../service/garden.service';
import {Garden} from '../../model/garden';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {ListEventService} from '../../../ui/list/service/list-event.service';
import {MapService} from '../../../map/service/map.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {QueryList} from '@angular/core';
import {Subscription} from 'rxjs';
import {ViewChildren} from '@angular/core';

@Component(
    {
        selector: 'st-garden-list',
        templateUrl: './garden-list.component.html',
        styleUrls: ['./garden-list.component.scss']
    }
)
export class GardenListComponent extends AbstractList<Garden> implements OnInit, OnDestroy {

    @ViewChildren(GardenListItemComponent, {read: ElementRef})
    protected _itemElements: QueryList<ElementRef>;

    private _gardensSubscription: Subscription;
    private _markerSubscription: Subscription;

    constructor(protected _listEventService: ListEventService,
                protected _layoutService: LayoutService,
                private _gardenService: GardenService,
                private _mapService: MapService) {
        super(_listEventService, _layoutService);
    }

    get gardens(): Garden[] {
        return this._items;
    }

    ngOnInit(): void {
        this._items = this._gardenService.getInMemory();
        this._gardensSubscription = this._gardenService.seedsObservable.subscribe(this._handleUpdate.bind(this));
        this._markerSubscription = this._mapService.gardenMarkerObservable.subscribe(this._handleMarkerEvent.bind(this));
    }

    ngOnDestroy(): void {
        this._gardensSubscription.unsubscribe();
        this._markerSubscription.unsubscribe();
    }
}
