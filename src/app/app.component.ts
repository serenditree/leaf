import {EXACT_MATCH_TRUE} from './utils/st-const';
import {AfterViewInit, Component, HostListener, OnDestroy, inject} from '@angular/core';
import {LayoutService} from './ui/layout/service/layout.service';
import {MapService} from './map/service/map.service';
import {MatIconRegistry} from '@angular/material/icon';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SearchService} from './search/service/search.service';
import {Subscription} from 'rxjs';
import {UpdateService} from './worker/service/update.service';
import {environment} from '../environments/environment';
import {filter} from 'rxjs/operators';

@Component(
    {
        selector: 'st-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss'],
        standalone: false
    }
)
export class AppComponent implements AfterViewInit, OnDestroy {
    private _updateService = inject(UpdateService);

    private _router = inject(Router);
    private _matIconRegistry = inject(MatIconRegistry);
    private _layoutService = inject(LayoutService);
    private _searchService = inject(SearchService);
    private _mapService = inject(MapService);
    private _mapNavigation = false;

    private _routerEventSubscription: Subscription;
    private _mapNavigationSubscription: Subscription;

    constructor() {
        this._matIconRegistry.registerFontClassAlias('fa');
    }

    get isProduction(): boolean {
        return environment.production;
    }

    get mapNavigation(): boolean {
        return this._mapNavigation;
    }

    get isMobile(): boolean {
        return this._layoutService.isMobile();
    }

    get isHomeActive(): boolean {
        return this._router.isActive('', EXACT_MATCH_TRUE) ||
               this._router.isActive('/seeds', EXACT_MATCH_TRUE) ||
               this._router.isActive('/gardens', EXACT_MATCH_TRUE);
    }

    ngAfterViewInit(): void {
        this._registerGlobalRouterActions();
        this._mapNavigationSubscription = this._mapService.mapNavigationObservable.subscribe(
            (mapNavigates) => {
                if (this._layoutService.isMobile()) {
                    if (mapNavigates) {
                        this._mapNavigation = true;
                    }
                }
            }
        );
    }

    ngOnDestroy(): void {
        this._routerEventSubscription.unsubscribe();
        this._mapNavigationSubscription.unsubscribe();
    }

    public contentClass(routerState: RouterOutlet): string {
        let stContent = 'st-content';
        if (this.hasSubmenu(routerState)) {
            stContent = 'st-content-sub';
        } else if (this._layoutService.isMobile()) {
            if (routerState.activatedRouteData['nomap']) {
                stContent = 'st-content-no-map';
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
            .subscribe(() => {
                window.scrollTo(0, 0);
                this._mapNavigation = false;
            });
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
        }
    }
}
