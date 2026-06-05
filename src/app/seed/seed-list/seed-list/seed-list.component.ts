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
  inject,
  ChangeDetectionStrategy
} from '@angular/core';
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
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class SeedListComponent extends AbstractList<Seed> implements OnInit, OnDestroy {
    private readonly _seedService = inject(SeedService);
    private readonly _mapService = inject(MapService);

    @ViewChildren(SeedListItemComponent, {read: ElementRef})
    protected _itemElements!: QueryList<ElementRef>;

    private _emptyListMessage = 'Nothing planted around here...';
    private readonly _onSeedsUpdateEmitter = new EventEmitter<Seed[]>();

    private _seedsSubscription!: Subscription;
    private _trailSubscription!: Subscription;
    private _markerSubscription!: Subscription;

    get emptyListMessage(): string {
        return this._emptyListMessage;
    }

    @Input()
    set emptyListMessage(value: string) {
        this._emptyListMessage = value;
    }

    @Output()
    get seedsUpdate(): EventEmitter<Seed[]> {
        return this._onSeedsUpdateEmitter;
    }

    get seeds(): Seed[] {
        return this._items;
    }

    ngOnInit(): void {
        super.ngOnInit();
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
