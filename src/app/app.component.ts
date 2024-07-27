import {EXACT_MATCH_TRUE} from './utils/st-const';
import {AfterViewInit} from '@angular/core';
import {Component} from '@angular/core';
import {ElementRef} from '@angular/core';
import {HostListener} from '@angular/core';
import {LayoutService} from './ui/layout/service/layout.service';
import {ListEventService} from './ui/list/service/list-event.service';
import {MapComponent} from './map/map/map.component';
import {MapService} from './map/service/map.service';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MatIconRegistry} from '@angular/material/icon';
import {MenuTopComponent} from './ui/menu/menu-top/menu-top.component';
import {NavigationEnd} from '@angular/router';
import {OnDestroy} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Router} from '@angular/router';
import {SearchService} from './search/service/search.service';
import {Subscription} from 'rxjs';
import {UpdateService} from './worker/service/update.service';
import {ViewChild} from '@angular/core';
import {environment} from '../environments/environment';
import {filter} from 'rxjs/operators';

@Component(
    {
        selector: 'st-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss']
    }
)
export class AppComponent implements AfterViewInit, OnDestroy {

    @ViewChild(MenuTopComponent, {read: ElementRef})
    private _menuTop: ElementRef;
    @ViewChild(MapComponent, {read: ElementRef})
    private _map: ElementRef;
    private _mapHeight: number;
    private _routerEventSubscription: Subscription;
    private _listEventSubscription: Subscription;
    private _mapVisibleSubscription: Subscription;
    private _resetBlock = false;

    constructor(private _router: Router,
                private _matIconRegistry: MatIconRegistry,
                private _updateService: UpdateService,
                private _bottomSheet: MatBottomSheet,
                private _layoutService: LayoutService,
                private _mapService: MapService,
                private _searchService: SearchService,
                private _listEventService: ListEventService) {

        this._matIconRegistry.registerFontClassAlias('fa');
    }

    get isProduction(): boolean {
        return environment.production;
    }

    get isHomeActive(): boolean {
        return this._router.isActive('', EXACT_MATCH_TRUE) ||
               this._router.isActive('/seeds', EXACT_MATCH_TRUE) ||
               this._router.isActive('/gardens', EXACT_MATCH_TRUE);
    }

    ngAfterViewInit(): void {
        this._registerGlobalRouterActions();

        const map = this._map.nativeElement.firstChild;
        this._mapHeight = map.offsetHeight;

        this._mapVisibleSubscription = this._mapService.mapVisibleObservable.subscribe(
            (visible) => {
                if (this._layoutService.isMobile()) {
                    if (visible.key()) {
                        this._resetView();
                    } else {
                        map.style.height = visible.value() + 'px';
                        this._resetBlock = true;
                    }
                }
            }
        );
        this._listEventSubscription = this._listEventService.listEventObservable.subscribe(
            (listEvent) => {
                if (listEvent.offset < this._mapHeight) {
                    map.classList.remove('st-slide');
                    const height = map.offsetHeight + listEvent.delta;
                    map.style.height = (height < this._mapHeight ? height : this._mapHeight) + 'px';
                } else {
                    map.classList.add('st-slide');
                    map.style.height = '0px';
                }
            }
        );
    }

    ngOnDestroy(): void {
        this._routerEventSubscription.unsubscribe();
        this._mapVisibleSubscription.unsubscribe();
        this._listEventSubscription.unsubscribe();
    }

    public contentClass(routerState: RouterOutlet): string {
        let stContent = 'st-content';
        if (this.hasSubmenu(routerState)) {
            stContent = 'st-content-sub';
        } else if (this._layoutService.isMobile()) {
            if (routerState.activatedRouteData['nomap']) {
                stContent = 'st-content-no-map';
                this._map.nativeElement.firstChild.style.height = '0px';
            }
        }

        return stContent;
    }

    public showSubmenu(routerState: RouterOutlet): boolean {
        return !!routerState.activatedRouteData['submenu'] &&
               !routerState.activatedRouteData['decentralized'];
    }

    private hasSubmenu(routerState: RouterOutlet): boolean {
        return !!routerState.activatedRouteData['submenu'];
    }

    private _registerGlobalRouterActions(): void {
        this._routerEventSubscription = this._router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(
                () => {
                    window.scrollTo(0, 0);
                    setTimeout(
                        () => {
                            this._resetView();
                        },
                        42
                    );
                }
            );
    }

    private _resetView(): void {
        const map = this._map.nativeElement.firstChild;
        map.classList.add('st-slide');
        map.style.height = this._mapHeight.toString() + 'px';
        this._resetBlock = false;
    }

    @HostListener('window:keydown', ['$event'])
    private _onKeyDown(event: KeyboardEvent): void {
        if (event.key === 'Escape') {
            this._searchService.setSearchFocus(false);
        } else if (!this._layoutService.isMobile() &&
                   !event.altKey &&
                   !event.ctrlKey &&
                   !event.metaKey &&
                   !event.shiftKey &&
                   event.target['nodeName'] !== 'INPUT' &&
                   event.target['nodeName'] !== 'TEXTAREA' &&
                   event.key.trim().length === 1) {

            this._searchService.setSearchFocus(true);
            this._resetView();
        }
    }

    @HostListener('window:resize')
    private _onViewportChange(): void {
        setTimeout(
            () => {
                if (!this._resetBlock) {
                    this._resetView();
                }
            },
            420
        );

    }
}
