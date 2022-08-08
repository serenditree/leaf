import {AbstractListItem} from '../../../ui/list/list/abstract-list-item';
import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {ListEventService} from '../../../ui/list/service/list-event.service';
import {Seed} from '../../model/seed';
import {StAnimations} from '../../../utils/st-animations';

@Component(
    {
        selector: 'st-seed-list-item',
        templateUrl: './seed-list-item.component.html',
        styleUrls: ['./seed-list-item.component.scss'],
        animations: [
            StAnimations.enterSlideHorizontal
        ]
    }
)
export class SeedListItemComponent extends AbstractListItem<Seed> {

    constructor(protected _layoutService: LayoutService,
                protected _listEventService: ListEventService) {
        super(_layoutService, _listEventService);
    }

    get seed(): Seed {
        return this._seed;
    }

    @Input()
    set seed(value: Seed) {
        this._seed = value;
    }
}
