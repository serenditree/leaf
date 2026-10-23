import {AbstractListItem} from '../../../ui/list/list/abstract-list-item';
import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Garden} from '../../model/garden';

@Component(
    {
        selector: 'st-garden-list-item',
        templateUrl: './garden-list-item.component.html',
        styleUrls: ['./garden-list-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class GardenListItemComponent extends AbstractListItem<Garden> {
    get garden(): Garden {
        return this._seed;
    }

    @Input()
    set garden(value: Garden) {
        this._seed = value;
    }
}
