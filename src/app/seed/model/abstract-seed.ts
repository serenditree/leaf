import {LngLat} from 'mapbox-gl';

export class AbstractSeed {
    public id: string;
    public created: string;
    public modified: string;
    public location: LngLat;
    public title: string;
    public text: string;
    public username: string;
    public userId: number;
    public anonymous: boolean;
    public tags: string[];
    public parent: string;
}
