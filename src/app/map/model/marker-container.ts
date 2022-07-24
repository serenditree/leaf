import {Marker} from 'mapbox-gl';

export class MarkerContainer {
    public id: string;
    public marker: Marker;
    public element: HTMLElement;

    constructor(id: string, marker: Marker, element: HTMLElement) {
        this.id = id;
        this.marker = marker;
        this.element = element;
    }
}
