import {AbstractListItem} from '../../../ui/list/list/abstract-list-item';
import {Component} from '@angular/core';
import {Garden} from '../../model/garden';
import {Input} from '@angular/core';
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
        ]
    }
)
export class GardenListItemComponent extends AbstractListItem<Garden> {

    constructor(protected _layoutService: LayoutService,
                protected _listEventService: ListEventService) {
        super(_layoutService, _listEventService);
    }

    get garden(): Garden {
        return this._seed;
    }

    @Input()
    set garden(value: Garden) {
        this._seed = value;
    }
}
