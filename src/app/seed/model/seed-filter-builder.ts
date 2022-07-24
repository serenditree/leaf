import {LngLatBounds} from 'mapbox-gl';
import {SeedFilter} from './seed-filter';
import {SeedSortingType} from './seed-sorting-type.enum';
import {Seed} from './seed';

// TODO fluent api builder
export class SeedFilterBuilder extends Seed {

    private _filter: SeedFilter = null;

    constructor() {
        super();
        this.reset();
    }

    public setBounds(bounds: LngLatBounds): SeedFilterBuilder {
        this._filter.bounds = bounds;
        return this;
    }

    public setUserId(userId: number): SeedFilterBuilder {
        this._filter.userId = userId;
        return this;
    }

    public setUsername(username: string): SeedFilterBuilder {
        this._filter.username = username;
        return this;
    }

    public setTags(tags: string[]): SeedFilterBuilder {
        this._filter.tags = tags;
        return this;
    }

    public setPoll(poll: boolean): SeedFilterBuilder {
        this._filter.poll = poll;
        return this;
    }

    public setTrail(trail: boolean): SeedFilterBuilder {
        this._filter.trail = trail;
        return this;
    }

    public setSort(sort: SeedSortingType): SeedFilterBuilder {
        this._filter.sort = sort;
        return this;
    }

    public setSkip(skip: number): SeedFilterBuilder {
        this._filter.skip = skip;
        return this;
    }

    public reset(): SeedFilterBuilder {
        let bounds = null;
        if (this._filter && this._filter.bounds) {
            bounds = this._filter.bounds;
        }
        this._filter = new SeedFilter();
        this._filter.sort = SeedSortingType.BY_WATER;
        this._filter.skip = 0;
        if (bounds) {
            this._filter.bounds = bounds;
        }

        return this;
    }

    public isModified(): boolean {
        return !!this._filter.userId ||
               !!this._filter.tags ||
               this._filter.sort !== SeedSortingType.BY_WATER ||
               this._filter.poll ||
               this._filter.trail;
    }

    public build(): SeedFilter {
        return this._filter;
    }
}
