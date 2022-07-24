import {AbstractList} from '../../../ui/list/list/abstract-list';
import {Component} from '@angular/core';
import {ElementRef} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Input} from '@angular/core';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {ListEventService} from '../../../ui/list/service/list-event.service';
import {MapService} from '../../../map/service/map.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {Output} from '@angular/core';
import {QueryList} from '@angular/core';
import {SeedListItemComponent} from '../seed-list-item/seed-list-item.component';
import {SeedService} from '../../service/seed.service';
import {Seed} from '../../model/seed';
import {Subscription} from 'rxjs';
import {ViewChildren} from '@angular/core';

@Component(
    {
        selector: 'st-seed-list',
        templateUrl: './seed-list.component.html',
        styleUrls: ['./seed-list.component.scss']
    }
)
export class SeedListComponent extends AbstractList<Seed> implements OnInit, OnDestroy {

    @ViewChildren(SeedListItemComponent, {read: ElementRef})
    protected _itemElements: QueryList<ElementRef>;

    private _emptyListMessage = 'Nothing planted around here...';
    private _onSeedsUpdateEmitter: EventEmitter<Seed[]> = new EventEmitter();

    private _seedsSubscription: Subscription;
    private _trailSubscription: Subscription;
    private _markerSubscription: Subscription;

    constructor(protected _listEventService: ListEventService,
                protected _layoutService: LayoutService,
                private _seedService: SeedService,
                private _mapService: MapService) {
        super(_listEventService, _layoutService);
    }

    get emptyListMessage(): string {
        return this._emptyListMessage;
    }

    @Input()
    set emptyListMessage(value: string) {
        this._emptyListMessage = value;
    }

    @Output()
    get onSeedsUpdate(): EventEmitter<Seed[]> {
        return this._onSeedsUpdateEmitter;
    }

    get seeds(): Seed[] {
        return this._items;
    }

    ngOnInit(): void {
        this._items = this._seedService.getInMemory();
        this._seedsSubscription = this._seedService.seedsObservable.subscribe(this._handleUpdate.bind(this));
        this._trailSubscription = this._seedService.trailObservable.subscribe(this._handleUpdate.bind(this));
        this._markerSubscription = this._mapService.seedMarkerObservable.subscribe(this._handleMarkerEvent.bind(this));
    }

    ngOnDestroy(): void {
        this._seedsSubscription.unsubscribe();
        this._trailSubscription.unsubscribe();
        this._markerSubscription.unsubscribe();
    }

    protected _onUpdate(items: Seed[]): void {
        this._onSeedsUpdateEmitter.emit(items);
    }
}
