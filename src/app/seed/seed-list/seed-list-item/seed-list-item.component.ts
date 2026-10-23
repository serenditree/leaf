import {AbstractListItem} from '../../../ui/list/list/abstract-list-item';
import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {Seed} from '../../model/seed';
import {environment} from '../../../../environments/environment';

@Component(
    {
        selector: 'st-seed-list-item',
        templateUrl: './seed-list-item.component.html',
        styleUrls: ['./seed-list-item.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class SeedListItemComponent extends AbstractListItem<Seed> {
    protected readonly environment = environment;

    get seed(): Seed {
        return this._seed;
    }

    @Input()
    set seed(value: Seed) {
        this._seed = value;
    }
}
