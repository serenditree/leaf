import {AbstractList} from '../../../ui/list/list/abstract-list';
import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, inject, ChangeDetectionStrategy} from '@angular/core';
import {GardenListItemComponent} from '../garden-list-item/garden-list-item.component';
import {GardenService} from '../../service/garden.service';
import {Garden} from '../../model/garden';
import {MapService} from '../../../map/service/map.service';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-garden-list',
        templateUrl: './garden-list.component.html',
        styleUrls: ['./garden-list.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class GardenListComponent extends AbstractList<Garden> implements OnInit, OnDestroy {
    private readonly _gardenService = inject(GardenService);
    private readonly _mapService = inject(MapService);

    @ViewChildren(GardenListItemComponent, {read: ElementRef})
    protected _itemElements!: QueryList<ElementRef>;

    private _gardensSubscription!: Subscription;
    private _markerSubscription!: Subscription;

    get gardens(): Garden[] {
        return this._items;
    }

    ngOnInit(): void {
        super.ngOnInit();
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
