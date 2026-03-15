import {EXACT_MATCH_TRUE} from '../../utils/st-const';

import {
    AfterViewInit,
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation,
    inject
} from '@angular/core';
import {FilterService} from '../../search/service/filter.service';
import {LayoutService} from '../../ui/layout/service/layout.service';
import {AddLayerObject, LngLat, LngLatBounds, LngLatBoundsLike, Map, Point} from 'maplibre-gl';
import {MapService} from '../service/map.service';
import {MarkerContainer} from '../model/marker-container';
import {Router} from '@angular/router';
import {SearchService} from '../../search/service/search.service';
import {Seed} from '../../seed/model/seed';
import {Subscription} from 'rxjs';
import {bbox, bezierSpline, lineString} from '@turf/turf';
import {environment} from '../../../environments/environment';

@Component(
    {
        selector: 'st-map',
        templateUrl: './map.component.html',
        styleUrls: ['./map.component.scss'],
        encapsulation: ViewEncapsulation.None, // styles for markers in MarkerService
        standalone: false
    }
)
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
    private _mapService = inject(MapService);
    private _searchService = inject(SearchService);
    private _filterService = inject(FilterService);
    private _layoutService = inject(LayoutService);
    private _router = inject(Router);

    public static readonly MARKER_FLY_TO_DURATION = 1400;
    public static readonly MARKER_FLY_TO_ZOOM = 16;
    public static readonly MARKER_FLY_TO_WEAK_ZOOM = 12;

    private static readonly MAP_CONTAINER = 'st-map';
    private static readonly MAP_STYLE = environment.API_URL_MAP;
    private static readonly MAP_DEFAULT_CENTER = new LngLat(16.359914169215926, 48.2088284029927);
    private static readonly MAP_DEFAULT_ZOOM = 12;
    private static readonly MAP_VIEWPORT_OFFSET = 20;
    private static readonly TRAIL_LAYER_ID = 'trail';
    private static readonly TRAIL_LAYER: AddLayerObject = {
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
    private _mapNavigation = false;
    private _mapNavigationSubscription: Subscription;
    private _isSearchFocused: boolean;
    private _isSearchFocusedSubscription: Subscription;
    private _isFilterFocused: boolean;
    private _isFilterFocusedSubscription: Subscription;

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

    get mapNavigation(): boolean {
        return this._mapNavigation;
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

        this._mapNavigationSubscription = this._mapService
            .mapNavigationSubject
            .subscribe(
                (mapNavigates) => {
                    if (this._layoutService.isMobile()) {
                        this._mapNavigation = mapNavigates;
                    }
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
    }

    ngAfterViewInit(): void {
        this._mapService.serve(this);
    }

    ngOnDestroy(): void {
        this._mapNavigationSubscription.unsubscribe();
        this._isSearchFocusedSubscription.unsubscribe();
        this._isFilterFocusedSubscription.unsubscribe();
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

    public fitBounds(boundingBox: LngLatBoundsLike): void {
        const mapOverlay = this._mapOverlay.nativeElement;

        this._map.fitBounds(
            boundingBox,
            {
                maxZoom: this._map.getMaxZoom(),
                minZoom: this._map.getMinZoom(),
                duration: MapComponent.MARKER_FLY_TO_DURATION,
                padding: {
                    top: MapComponent.MAP_VIEWPORT_OFFSET,
                    bottom: MapComponent.MAP_VIEWPORT_OFFSET,
                    left: mapOverlay.offsetWidth + MapComponent.MAP_VIEWPORT_OFFSET,
                    right: mapOverlay.offsetWidth + MapComponent.MAP_VIEWPORT_OFFSET
                }
            }
        );
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

    public addTrail(seeds: Seed[]): boolean {
        let isTrailOnMap = false;
        if (seeds.length > 1) {
            const trail = lineString(
                seeds.map(seed => [seed.location.lng, seed.location.lat])
            );

            this._map.addSource(
                MapComponent.TRAIL_LAYER_ID,
                {
                    type: 'geojson',
                    data: bezierSpline(trail, {sharpness: .8})

                }
            );
            this._map.addLayer(MapComponent.TRAIL_LAYER);
            isTrailOnMap = true;

            this.fitBounds(bbox(trail) as LngLatBoundsLike);
        }

        return isTrailOnMap;
    }

    public removeTrail(): void {
        if (this._map.getLayer(MapComponent.TRAIL_LAYER_ID)) {
            this._map.removeLayer(MapComponent.TRAIL_LAYER_ID);
            this._map.removeSource(MapComponent.TRAIL_LAYER_ID);
        }
    }
}
