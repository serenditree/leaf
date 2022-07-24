import {Component} from '@angular/core';
import {Seed} from '../model/seed';

@Component(
    {
        selector: 'st-seed-trail',
        templateUrl: './seed-trail.component.html',
        styleUrls: ['./seed-trail.component.scss']
    }
)
export class SeedTrailComponent {

    private _parent: Seed;

    get trailState(): any {
        return {
            seed: this._parent,
            isGarden: false,
            isTrail: true
        };
    }

    public onSeedsUpdate(seeds: Seed[]): void {
        this._parent = seeds[0];
    }
}
