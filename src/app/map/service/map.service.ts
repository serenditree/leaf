import {AbstractSeed} from '../../seed/model/abstract-seed';
import {BehaviorSubject} from 'rxjs';
import {GardenService} from '../../garden/service/garden.service';
import {Injectable} from '@angular/core';
import {ListEventService} from '../../ui/list/service/list-event.service';
import {LngLat} from 'mapbox-gl';
import {MapComponent} from '../map/map.component';
import {MarkerContainer} from '../model/marker-container';
import {MarkerContext} from '../model/marker-context';
import {MarkerEvent} from '../model/marker-event';
import {MarkerType} from '../model/marker-type.enum';
import {Marker} from 'mapbox-gl';
import {NavigationStart} from '@angular/router';
import {Observable} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {SeedService} from '../../seed/service/seed.service';
import {Subject} from 'rxjs';
import {Subscription} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MapService implements OnDestroy {

    private readonly MARKER_UPDATE_TIMEOUT = 700;
    private readonly MARKER_FONT_SIZE_DEFAULT = 18;
    private readonly MARKER_FONT_SIZE_MAX = 22;
    private readonly MARKER_ATTR_ACTIVE_KEY = 'st-active';
    private readonly MARKER_ATTR_ACTIVE_VAL = 'true';
    private readonly SEED_PATH_REGEX = /\/seeds\/\S+/;
    private readonly GARDEN_PATH_REGEX = /\/gardens\/\S+/;

    private _mapComponent: MapComponent;
    private _singleMarker: MarkerContainer;
    private _seedMarkers: MarkerContainer[] = [];
    private _seedMarkerSubject = new BehaviorSubject<MarkerEvent>(new MarkerEvent());
    private _seedsSubscription: Subscription;
    private _trailMarkers: MarkerContainer[] = [];
    private _trailSubscription: Subscription;
    private _trail: string;
    private _isTrailOnMap = false;
    private _gardenMarkers: MarkerContainer[] = [];
    private _gardenMarkerSubject = new BehaviorSubject<MarkerEvent>(new MarkerEvent());
    private _gardensSubscription: Subscription;
    private _listItemEventSubscription: Subscription;
    private _markerContext: MarkerContext = new MarkerContext();
    private _updateMarkersTimeout: any;
    private _center: LngLat;
    private _centerSubject = new Subject<LngLat>();
    private _zoom: number;

    constructor(private _router: Router,
                private _seedService: SeedService,
                private _gardenService: GardenService,
                private _listEventService: ListEventService) {
    }

    get seedMarkerObservable(): Observable<MarkerEvent> {
        return this._seedMarkerSubject.asObservable();
    }

    get gardenMarkerObservable(): Observable<MarkerEvent> {
        return this._gardenMarkerSubject.asObservable();
    }

    get centerObservable(): Observable<LngLat> {
        return this._centerSubject.asObservable();
    }

    ngOnDestroy(): void {
        this._seedsSubscription.unsubscribe();
        this._trailSubscription.unsubscribe();
        this._gardensSubscription.unsubscribe();
        this._listItemEventSubscription.unsubscribe();
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// API
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    public serve(mapComponent: MapComponent): void {
        this._mapComponent = mapComponent;

        this._center = this._mapComponent.getCenter();
        this._zoom = this._mapComponent.getZoom();

        this._subscribeToRouterEvents();
        this._subscribeToUpdateEvents();
        this._subscribeToListEvents();
        this._registerBoundsChangeActions();
    }

    public setLocation(): void {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (position) {
                        this._mapComponent.flyTo(
                            new LngLat(
                                position.coords.longitude,
                                position.coords.latitude
                            ),
                            this._mapComponent.getZoom()
                        );
                    }
                },
                (error) => console.log(error),
                {enableHighAccuracy: true}
            );
        }
    }

    public getCenter(): LngLat {
        return this._center;
    }

    public setCenter(center: LngLat): void {
        this._mapComponent.setCenter(center);
        this._mapComponent.setZoom(MapComponent.MARKER_FLY_TO_ZOOM);
    }

    public getZoom(): number {
        return this._mapComponent.getZoom();
    }

    public addSingleMarker(id: string, lngLat: LngLat, type: MarkerType): void {
        if (!this._markerContext.fromList) {
            this._removeSingleMarker();
            this._singleMarker = this._createMarker(id, lngLat, this.MARKER_FONT_SIZE_DEFAULT, type);
            this._mapComponent.setCenter(lngLat);
        }
        this._markerContext.fromList = false;
    }

    public weakLocalAlignment(set = true): void {
        if (set) {
            this._mapComponent.flyTo(this._mapComponent.getCenter(), MapComponent.MARKER_FLY_TO_WEAK_ZOOM);
        } else {
            this._mapComponent.flyTo(this._mapComponent.getCenter(), MapComponent.MARKER_FLY_TO_ZOOM);
        }
    }

    public lock(): void {
        this._mapComponent.lock();
    }

    public unlock(): void {
        this._mapComponent.unlock();
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ROUTER EVENTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private _subscribeToRouterEvents(): void {
        void this._router.events.forEach((event) => {
            if (event instanceof NavigationStart) {
                this._markerContext.from = this._router.getCurrentNavigation().extras;
                if (['/', '/seeds', '/gardens'].includes(event.url)) {
                    this._onMultiRoute(event.url);
                } else if (event.url.startsWith('/trail')) {
                    this._onTrailRoute(event.url);
                } else {
                    this._onSingleRoute(event.url);
                }
            }
        });
    }

    private _onMultiRoute(url: string): void {
        this._markerContext.persistent = false;
        if (['/', '/seeds'].includes(url)) {
            this._markerContext.type = MarkerType.SEED;
            this._markerContext.update = this._seedMarkers.length === 0;
            this._hideMarkers(MarkerType.GARDEN);
            this._showMarkers(MarkerType.SEED);
        } else {
            this._markerContext.type = MarkerType.GARDEN;
            this._markerContext.update = this._gardenMarkers.length === 0;
            this._hideMarkers(MarkerType.SEED);
            this._showMarkers(MarkerType.GARDEN);
        }
        // Avoid marker update on return from a view where map bounds were changed and are now restored!
        setTimeout(
            () => {
                this._markerContext.update = true;
            },
            400
        );
    }

    private _onSingleRoute(url: string): void {
        this._markerContext.update = false;
        if (!this._markerContext.type) {
            // Direct access from external. No on-site navigation would set persistent to true.
            this._markerContext.persistent = true;
        }
        if (this.SEED_PATH_REGEX.test(url)) {
            this._markerContext.type = MarkerType.SEED;
            if (this._markerContext.from.state) {
                this._mapComponent.clearMarkers();
            } else {
                this._hideMarkers(MarkerType.SEED, this._seedMarkerSubject.getValue().id);
            }
        } else if (this.GARDEN_PATH_REGEX.test(url)) {
            this._markerContext.type = MarkerType.SEED;
            if (this._markerContext.from.state) {
                this._mapComponent.clearMarkers();
            } else {
                this._hideMarkers(MarkerType.GARDEN, this._gardenMarkerSubject.getValue().id);
            }
        } else {
            this._mapComponent.clearMarkers();
        }
    }

    private _onTrailRoute(url: string): void {
        this._markerContext.type = MarkerType.TRAIL;
        this._markerContext.update = false;
        this._markerContext.persistent = false;
        this._trail = url.split('/').reverse()[0];
        this._mapComponent.clearMarkers();
        this._showMarkers(MarkerType.TRAIL);
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SEED EVENTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private _subscribeToUpdateEvents(): void {
        this._seedsSubscription = this._seedService.seedsObservable.subscribe((seeds) => {
            if (this._markerContext.update) {
                this._mapComponent.clearMarkers();
                this._seedMarkers = [];
                this._addMarkers(seeds, this._seedMarkers, MarkerType.SEED);
            }
        });

        this._trailSubscription = this._seedService.trailObservable.subscribe((seeds) => {
            this._trailMarkers = [];
            this._addMarkers(seeds, this._trailMarkers, MarkerType.TRAIL);
            this._mapComponent.addTrail(seeds);
            this._isTrailOnMap = true;
        });

        this._gardensSubscription = this._gardenService.seedsObservable.subscribe((gardens) => {
            if (this._markerContext.update) {
                this._mapComponent.clearMarkers();
                this._gardenMarkers = [];
                this._addMarkers(gardens, this._gardenMarkers, MarkerType.GARDEN);
            }
        });
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LIST EVENTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private _subscribeToListEvents(): void {
        this._listItemEventSubscription = this._listEventService.listItemEventObservable.subscribe(
            (listItemEvent) => {
                this._onItemEvent(listItemEvent.id, false, listItemEvent.navigate);
            }
        );
    }

    private _onItemEvent(id: string, scroll: boolean = false, navigate: boolean = false): void {
        let markerSubject;
        if (this._markerContext.type === MarkerType.SEED || this._markerContext.type === MarkerType.TRAIL) {
            markerSubject = this._seedMarkerSubject;
        } else {
            markerSubject = this._gardenMarkerSubject;
        }
        markerSubject.next({id: id, scroll: scroll, navigate: navigate});

        if (navigate) {
            this._navigateTo(id);
        } else {
            this._activateMarker(id);
        }
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// BOUNDS CHANGE EVENTS
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private _registerBoundsChangeActions(): void {
        this._mapComponent.onMoveStart(this._onBoundsChangeStart.bind(this));
        this._mapComponent.onMoveEnd(this._onBoundsChangeEnd.bind(this));
    }

    private _onBoundsChangeStart(): void {
        if (this._markerContext.update) {
            clearTimeout(this._updateMarkersTimeout);
        }
    }

    private _onBoundsChangeEnd(timeout: boolean = true): void {
        if (this._markerContext.update) {
            this._updateMarkers(timeout);
        }
        this._centerSubject.next(this._mapComponent.getCenter());
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MARKER VISIBILITY
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private _navigateTo(id: string): void {
        this._markerContext.fromList = true;
        let markers: MarkerContainer[];

        if (this._markerContext.type === MarkerType.SEED || this._markerContext.type === MarkerType.TRAIL) {
            if (this._isTrailOnMap) {
                markers = this._trailMarkers;
            } else {
                markers = this._seedMarkers;
            }
            void this._router.navigate(['/seeds', id]);
        } else {
            markers = this._gardenMarkers;
            void this._router.navigate(['/gardens', id]);
        }

        if (!this._markerContext.persistent) {
            this._markerContext.persistent = true;
            const targetMarker = markers.find((marker) => marker.id === id);
            this._deactivateMarker(targetMarker);
            this._mapComponent.flyTo(targetMarker.marker.getLngLat(), MapComponent.MARKER_FLY_TO_ZOOM);
        }
    }

    private _updateMarkers(timeout: boolean = true): void {
        this._updateMarkersTimeout = setTimeout(
            () => {
                this._mapComponent.clearMarkers();

                if (this._markerContext.type === MarkerType.SEED || this._markerContext.type === MarkerType.GARDEN) {
                    this._center = this._mapComponent.getCenter();
                    this._zoom = this._mapComponent.getZoom();
                }

                if (this._markerContext.type === MarkerType.SEED) {
                    this._seedService.retrieveByGlobalFilter(this._mapComponent.getBounds());
                } else if (this._markerContext.type === MarkerType.TRAIL) {
                    this._seedService.retrieveTrailById(this._trail);
                } else {
                    this._gardenService.retrieveByGlobalFilter(this._mapComponent.getBounds());
                }

            },
            timeout ? this.MARKER_UPDATE_TIMEOUT : 0
        );
    }

    private _addMarkers<T extends AbstractSeed>(seeds: T[],
                                                markerContainer: MarkerContainer[],
                                                type: MarkerType): void {
        seeds.forEach((seed, index) => {
            markerContainer.push(this._createMarker(
                seed.id,
                new LngLat(seed.location.lng, seed.location.lat),
                this.MARKER_FONT_SIZE_MAX - index,
                type,
                type === this._markerContext.type
            ));
        });
    }

    private _showMarkers(type: MarkerType): void {
        this._removeSingleMarker();

        if (type === MarkerType.SEED && this._seedMarkers.length > 0) {
            this._restoreMarkers(this._seedMarkers);
        } else if (type === MarkerType.GARDEN && this._gardenMarkers.length > 0) {
            this._restoreMarkers(this._gardenMarkers);
        } else {
            this._updateMarkers(false);
        }
    }

    private _hideMarkers(type?: MarkerType, exceptId?: string): void {
        if (this._markerContext.update) {
            this._removeSingleMarker();
        }

        if (this._isTrailOnMap) {
            this._mapComponent.removeTrail();
            this._isTrailOnMap = false;
        }

        if (!this._markerContext.persistent) {
            let markersToHide: MarkerContainer[] = [];

            if (type === MarkerType.SEED) {
                markersToHide = this._seedMarkers.concat(this._trailMarkers);
            } else if (type === MarkerType.GARDEN) {
                markersToHide = this._gardenMarkers.concat(this._trailMarkers);
            }

            if (exceptId) {
                markersToHide = markersToHide.filter((marker) => marker.id !== exceptId);
            }

            this._mapComponent.removeMarkers(...markersToHide);
        }
    }

    private _restoreMarkers(markerContainers: MarkerContainer[]): void {
        this._mapComponent.setCenter(this._center);
        this._mapComponent.setZoom(this._zoom);
        this._mapComponent.addMarkers(...markerContainers);
    }

    private _removeSingleMarker(): void {
        if (this._singleMarker) {
            this._mapComponent.removeMarkers(this._singleMarker);
            this._singleMarker = null;
        }
    }

    private _activateMarker(id: string): void {
        let markers: MarkerContainer[];
        if (this._markerContext.type === MarkerType.SEED) {
            markers = this._seedMarkers;
        } else if (this._markerContext.type === MarkerType.TRAIL) {
            markers = this._trailMarkers;
        } else {
            markers = this._gardenMarkers;
        }

        markers.forEach((marker) => {
            if (marker.id === id) {
                marker.element.setAttribute(this.MARKER_ATTR_ACTIVE_KEY, this.MARKER_ATTR_ACTIVE_VAL);
                marker.element.classList.add('click');
            } else {
                this._deactivateMarker(marker);
            }
        });
    }

    private _deactivateMarker(marker: MarkerContainer): void {
        marker.element.setAttribute(this.MARKER_ATTR_ACTIVE_KEY, '');
        marker.element.classList.remove('click');
        marker.element.classList.remove('mouseover');
    }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MARKER CREATION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    private _createMarker(id: string,
                          lngLat: LngLat,
                          size: number,
                          type: MarkerType,
                          show: boolean = true): MarkerContainer {
        const markerElement = this._createMarkerElement(id, size, type);
        const marker = new Marker(markerElement);
        marker.setLngLat(lngLat);
        const markerContainer = new MarkerContainer(id, marker, markerElement);

        if (show) {
            this._mapComponent.addMarkers(markerContainer);
        }

        return markerContainer;
    }

    private _createMarkerElement(id: string, size: number, type: MarkerType): HTMLElement {
        const markerElement = document.createElement('div');
        markerElement.className = 'st-marker';

        const markerIcon = document.createElement('em');
        markerIcon.style.fontSize = `${size}px`;
        markerIcon.className = 'fa st-marker-icon';

        if (type === MarkerType.SEED || type === MarkerType.TRAIL) {
            markerIcon.classList.add('fa-leaf', 'st-leaf-green');
        } else {
            markerIcon.classList.add('fa-tag', 'st-garden-gray');
        }

        if (Math.random() > .5) {
            markerIcon.classList.add('st-flipped-horizontally');
        }
        markerElement.appendChild(markerIcon);

        this._addMarkerEventListeners(id, markerElement, markerIcon);

        return markerElement;
    }

    private _addMarkerEventListeners(id: string, markerElement: HTMLElement, markerIcon: HTMLElement): void {
        markerIcon.addEventListener('click', () => {
            const navigate = markerElement.getAttribute(this.MARKER_ATTR_ACTIVE_KEY) === this.MARKER_ATTR_ACTIVE_VAL;
            this._onItemEvent(id, !navigate, navigate);
        });
        markerIcon.addEventListener('mouseover', () => {
            if (markerElement.getAttribute(this.MARKER_ATTR_ACTIVE_KEY) !== this.MARKER_ATTR_ACTIVE_VAL) {
                markerElement.classList.add('mouseover');
            }
        });
        markerIcon.addEventListener('mouseout', () => {
            if (markerElement.getAttribute(this.MARKER_ATTR_ACTIVE_KEY) !== this.MARKER_ATTR_ACTIVE_VAL) {
                markerElement.classList.remove('mouseover');
            }
        });
    }
}
