import {LngLatBounds} from 'mapbox-gl';
import {SeedSortingType} from './seed-sorting-type.enum';
import {Seed} from './seed';

export class SeedFilter extends Seed {
    public bounds: LngLatBounds;
    public sort: SeedSortingType;
    public skip = 0;
    public limit = 10;
}
