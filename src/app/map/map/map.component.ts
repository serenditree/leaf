import {EXACT_MATCH_FALSE} from '../../utils/st-const';
import {EXACT_MATCH_TRUE} from '../../utils/st-const';
import * as GeoViewport from '@mapbox/geo-viewport';
import {AfterViewInit} from '@angular/core';
import {Component} from '@angular/core';
import {ElementRef} from '@angular/core';
import {FilterService} from '../../search/service/filter.service';
import {LayoutService} from '../../ui/layout/service/layout.service';
import {LineLayer} from 'mapbox-gl';
import {ListEventService} from '../../ui/list/service/list-event.service';
import {LngLatBounds} from 'mapbox-gl';
import {LngLat} from 'mapbox-gl';
import {MapService} from '../service/map.service';
import {Map} from 'mapbox-gl';
import {MarkerContainer} from '../model/marker-container';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {Point} from 'mapbox-gl';
import {Router} from '@angular/router';
import {SearchService} from '../../search/service/search.service';
import {Seed} from '../../seed/model/seed';
import {StAnimations} from '../../utils/st-animations';
import {Subscription} from 'rxjs';
import {ViewChild} from '@angular/core';
import {ViewEncapsulation} from '@angular/core';
import {bbox} from '@turf/turf';
import {bezierSpline} from '@turf/turf';
import {environment} from '../../../environments/environment';
import {lineString} from '@turf/turf';

@Component(
    {
        selector: 'st-map',
        templateUrl: './map.component.html',
        styleUrls: ['./map.component.scss'],
        encapsulation: ViewEncapsulation.None, // styles for markers in MarkerService
        animations: [
            StAnimations.enterFade
        ]
    }
)
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {

    public static readonly MARKER_FLY_TO_DURATION = 1400;
    public static readonly MARKER_FLY_TO_ZOOM = 16;
    public static readonly MARKER_FLY_TO_WEAK_ZOOM = 12;

    private static readonly MAP_CONTAINER = 'st-map';
    private static readonly MAP_STYLE = environment.API_URL_MAP;
    private static readonly MAP_DEFAULT_CENTER = new LngLat(16.359914169215926, 48.2088284029927);
    private static readonly MAP_DEFAULT_ZOOM = 12;
    private static readonly MAP_VIEWPORT_OFFSET = 10;
    private static readonly MAP_TILE_SIZE = 512;
    private static readonly TRAIL_LAYER_ID = 'trail';
    private static readonly TRAIL_LAYER: LineLayer = {
        id: MapComponent.TRAIL_LAYER_ID,
        source: MapComponent.TRAIL_LAYER_ID,
        type: 'line',
        paint: {
            'line-color': '#666',
            'line-dasharray': [3, 3]
        }
    };

    @ViewChild('mapContainer', {static: true})
    private readonly _mapContainer: ElementRef;
    @ViewChild('mapOverlay', {static: true})
    private readonly _mapOverlay: ElementRef;

    private _map: Map;
    private _markers: MarkerContainer[] = [];
    private _isSearchFocused: boolean;
    private _isSearchFocusedSubscription: Subscription;
    private _isFilterFocused: boolean;
    private _isFilterFocusedSubscription: Subscription;
    private _showControl = true;
    private _listEventSubscription: Subscription;

    constructor(private _mapService: MapService,
                private _searchService: SearchService,
                private _filterService: FilterService,
                private _layoutService: LayoutService,
                private _listEventService: ListEventService,
                private _router: Router) {
    }

    get showSearchOverlay(): boolean {
        return !this._layoutService.isMobile() && this._isSearchFocused;
    }

    get showFilterOverlay(): boolean {
        return !this._layoutService.isMobile() && this._isFilterFocused;
    }

    get showIndicator(): boolean {
        return this._router.isActive('seed', EXACT_MATCH_TRUE) ||
               this._router.isActive('cultivate', EXACT_MATCH_TRUE);
    }

    get showControl(): boolean {
        return this._showControl &&
               ! this._router.isActive('about', EXACT_MATCH_TRUE) &&
               ! this._router.isActive('sign-in', EXACT_MATCH_FALSE) &&
               ! this._router.isActive('sign-up', EXACT_MATCH_FALSE);
    }

    ngOnInit(): void {
        this._map = new Map(
            {
                container: MapComponent.MAP_CONTAINER,
                style: MapComponent.MAP_STYLE,
                center: MapComponent.MAP_DEFAULT_CENTER,
                zoom: MapComponent.MAP_DEFAULT_ZOOM,
                attributionControl: false
            }
        );

        this._isSearchFocusedSubscription = this._searchService
            .isFocusedObservable
            .subscribe(
                (state) => {
                    this._isSearchFocused = state;
                }
            );

        this._isFilterFocusedSubscription = this._filterService
            .isFocusedObservable
            .subscribe(
                (state) => {
                    this._isFilterFocused = state;
                }
            );

        this._listEventSubscription = this._listEventService.listEventObservable
            .subscribe(
                (listEvent) => {
                    this._showControl = listEvent.offset <= 0;
                }
            );
    }

    ngAfterViewInit(): void {
        this._mapService.serve(this);
    }

    ngOnDestroy(): void {
        this._isSearchFocusedSubscription.unsubscribe();
        this._isFilterFocusedSubscription.unsubscribe();
        this._listEventSubscription.unsubscribe();
    }

    public locate(): void {
        this._mapService.setLocation();
    }

    public getCenter(): LngLat {
        return this._map.getCenter();
    }

    public setCenter(center: LngLat): void {
        this._map.setCenter(center);
    }

    public getZoom(): number {
        return this._map.getZoom();
    }

    public setZoom(zoom: number): void {
        this._map.setZoom(zoom);
    }

    public lock(): void {
        this._map.setMaxBounds(this._map.getBounds());
        this._map.setMaxZoom(this._map.getZoom());
        this._map.setMinZoom(this._map.getZoom());
        this._map.setMaxPitch(this._map.getPitch());
        this._map.setMinPitch(this._map.getPitch());
    }

    public unlock(): void {
        this._map.setMaxBounds(null);
        this._map.setMaxZoom(null);
        this._map.setMinZoom(null);
        this._map.setMaxPitch(null);
        this._map.setMinPitch(null);
    }

    public onMoveStart(callback: () => void): void {
        this._map.on('movestart', callback);
    }

    public onMoveEnd(callback: () => void): void {
        this._map.on('moveend', callback);
    }

    public getBounds(): LngLatBounds {
        const mapContainer = this._mapContainer.nativeElement;
        const mapOverlay = this._mapOverlay.nativeElement;

        const sw = new Point(
            mapOverlay.offsetWidth + MapComponent.MAP_VIEWPORT_OFFSET,
            mapContainer.offsetHeight - MapComponent.MAP_VIEWPORT_OFFSET
        );
        const ne = new Point(
            mapContainer.offsetWidth - mapOverlay.offsetWidth - MapComponent.MAP_VIEWPORT_OFFSET,
            MapComponent.MAP_VIEWPORT_OFFSET
        );

        return new LngLatBounds(this._map.unproject(sw), this._map.unproject(ne));
    }

    public fitBounds(boundingBox: number[]): void {
        const mapContainer = this._mapContainer.nativeElement;
        const mapOverlay = this._mapOverlay.nativeElement;

        const viewport = GeoViewport.viewport(
            boundingBox,
            [
                mapContainer.offsetWidth - MapComponent.MAP_VIEWPORT_OFFSET * 2 - mapOverlay.offsetWidth * 2,
                mapContainer.offsetHeight - MapComponent.MAP_VIEWPORT_OFFSET * 2
            ],
            this._map.getMinZoom(),
            this._map.getMaxZoom(),
            MapComponent.MAP_TILE_SIZE
        );

        this.flyTo(new LngLat(viewport.center[0], viewport.center[1]), viewport.zoom);
    }

    public flyTo(center: LngLat, zoom: number): void {
        this._map.flyTo(
            {
                center: center,
                duration: MapComponent.MARKER_FLY_TO_DURATION,
                zoom: zoom
            }
        );
    }

    public addMarkers(...markerContainers: MarkerContainer[]): void {
        markerContainers.forEach(
            (markerContainer) => {
                markerContainer.marker.addTo(this._map);
                this._markers.push(markerContainer);
            }
        );
    }

    public removeMarkers(...markerContainers: MarkerContainer[]): void {
        markerContainers.forEach((markerContainer) => markerContainer.marker.remove());
        this._markers = this._markers
            .filter(
                (current) => !markerContainers.find(
                    (toRemove) => current.id === toRemove.id
                )
            );
    }

    public clearMarkers(): void {
        this._markers.forEach((markerContainer) => markerContainer.marker.remove());
        this._markers = [];
    }

    public addTrail(seeds: Seed[]): void {
        const trail = lineString(seeds.map(seed => [seed.location.lng, seed.location.lat]));

        this._map.addSource(
            MapComponent.TRAIL_LAYER_ID,
            {
                type: 'geojson',
                data: bezierSpline(trail, {sharpness: .8})

            }
        );
        this._map.addLayer(MapComponent.TRAIL_LAYER);

        this.fitBounds(bbox(trail));
    }

    public removeTrail(): void {
        this._map.removeLayer(MapComponent.TRAIL_LAYER_ID);
        this._map.removeSource(MapComponent.TRAIL_LAYER_ID);
    }
}
