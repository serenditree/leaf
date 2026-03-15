import {AbstractList} from '../../../ui/list/list/abstract-list';
import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    QueryList,
    ViewChildren,
    inject
} from '@angular/core';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {ListEventService} from '../../../ui/list/service/list-event.service';
import {MapService} from '../../../map/service/map.service';
import {SeedListItemComponent} from '../seed-list-item/seed-list-item.component';
import {SeedService} from '../../service/seed.service';
import {Seed} from '../../model/seed';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-seed-list',
        templateUrl: './seed-list.component.html',
        styleUrls: ['./seed-list.component.scss'],
        standalone: false
    }
)
export class SeedListComponent extends AbstractList<Seed> implements OnInit, OnDestroy {
    protected _listEventService: ListEventService;
    protected _layoutService: LayoutService;
    private _seedService = inject(SeedService);
    private _mapService = inject(MapService);

    @ViewChildren(SeedListItemComponent, {read: ElementRef})
    protected _itemElements: QueryList<ElementRef>;

    private _emptyListMessage = 'Nothing planted around here...';
    private _onSeedsUpdateEmitter = new EventEmitter<Seed[]>();

    private _seedsSubscription: Subscription;
    private _trailSubscription: Subscription;
    private _markerSubscription: Subscription;

    constructor() {
        const _listEventService = inject(ListEventService);
        const _layoutService = inject(LayoutService);

        super(_listEventService, _layoutService);

        this._listEventService = _listEventService;
        this._layoutService = _layoutService;
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
        super._onInit();
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
