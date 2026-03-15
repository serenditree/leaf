import {AbstractList} from '../../../ui/list/list/abstract-list';
import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject} from '@angular/core';
import {GardenListItemComponent} from '../garden-list-item/garden-list-item.component';
import {GardenService} from '../../service/garden.service';
import {Garden} from '../../model/garden';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {ListEventService} from '../../../ui/list/service/list-event.service';
import {MapService} from '../../../map/service/map.service';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-garden-list',
        templateUrl: './garden-list.component.html',
        styleUrls: ['./garden-list.component.scss'],
        standalone: false
    }
)
export class GardenListComponent extends AbstractList<Garden> implements OnInit, OnDestroy {
    protected _listEventService: ListEventService;
    protected _layoutService: LayoutService;
    private _gardenService = inject(GardenService);
    private _mapService = inject(MapService);

    @ViewChildren(GardenListItemComponent, {read: ElementRef})
    protected _itemElements: QueryList<ElementRef>;

    private _gardensSubscription: Subscription;
    private _markerSubscription: Subscription;

    constructor() {
        const _listEventService = inject(ListEventService);
        const _layoutService = inject(LayoutService);

        super(_listEventService, _layoutService);

        this._listEventService = _listEventService;
        this._layoutService = _layoutService;
    }

    get gardens(): Garden[] {
        return this._items;
    }

    ngOnInit(): void {
        super._onInit();
        this._items = this._gardenService.getInMemory();
        this._gardensSubscription = this._gardenService
            .seedsObservable
            .subscribe(this._handleUpdate.bind(this));
        this._markerSubscription = this._mapService
            .gardenMarkerObservable
            .subscribe(this._handleMarkerEvent.bind(this));
    }

    ngOnDestroy(): void {
        this._gardensSubscription.unsubscribe();
        this._markerSubscription.unsubscribe();
    }
}
