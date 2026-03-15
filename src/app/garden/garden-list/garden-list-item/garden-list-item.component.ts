import {AbstractListItem} from '../../../ui/list/list/abstract-list-item';
import {Component, Input, inject} from '@angular/core';
import {Garden} from '../../model/garden';
import {LayoutService} from '../../../ui/layout/service/layout.service';
import {ListEventService} from '../../../ui/list/service/list-event.service';
import {StAnimations} from '../../../utils/st-animations';

@Component(
    {
        selector: 'st-garden-list-item',
        templateUrl: './garden-list-item.component.html',
        styleUrls: ['./garden-list-item.component.scss'],
        animations: [
            StAnimations.enterSlideHorizontal
        ],
        standalone: false
    }
)
export class GardenListItemComponent extends AbstractListItem<Garden> {
    protected _layoutService: LayoutService;
    protected _listEventService: ListEventService;

    constructor() {
        const _layoutService = inject(LayoutService);
        const _listEventService = inject(ListEventService);

        super(_layoutService, _listEventService);

        this._layoutService = _layoutService;
        this._listEventService = _listEventService;
    }

    get garden(): Garden {
        return this._seed;
    }

    @Input()
    set garden(value: Garden) {
        this._seed = value;
    }
}
