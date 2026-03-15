import {AbstractListItem} from '../../../ui/list/list/abstract-list-item';
import {Component, Input, inject} from '@angular/core';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {ListEventService} from '../../../ui/list/service/list-event.service';
import {Seed} from '../../model/seed';
import {environment} from '../../../../environments/environment';

@Component(
    {
        selector: 'st-seed-list-item',
        templateUrl: './seed-list-item.component.html',
        styleUrls: ['./seed-list-item.component.scss'],
        standalone: false
    }
)
export class SeedListItemComponent extends AbstractListItem<Seed> {
    protected _layoutService: LayoutService;
    protected _listEventService: ListEventService;

    protected readonly environment = environment;

    constructor() {
        const _layoutService = inject(LayoutService);
        const _listEventService = inject(ListEventService);

        super(_layoutService, _listEventService);

        this._layoutService = _layoutService;
        this._listEventService = _listEventService;
    }

    get seed(): Seed {
        return this._seed;
    }

    @Input()
    set seed(value: Seed) {
        this._seed = value;
    }
}
