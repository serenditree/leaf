import {EXACT_MATCH_TRUE} from './utils/st-const';
import {AfterViewInit, Component, HostListener, OnDestroy, inject, ChangeDetectionStrategy} from '@angular/core';
import {LayoutService} from './ui/layout/service/layout.service';
import {MapService} from './map/service/map.service';
import {MatIconRegistry} from '@angular/material/icon';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {SearchService} from './search/service/search.service';
import {Subscription} from 'rxjs';
import {BehaviorSubject} from 'rxjs';
import {UpdateService} from './worker/service/update.service';
import {environment} from '../environments/environment';
import {filter} from 'rxjs/operators';

@Component(
    {
        selector: 'st-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
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
    private _mapNavigationSubject: BehaviorSubject<boolean>;

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
        this._routerEventSubscription = this._router
            .events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(
                () => {
                    window.scrollTo(0, 0);
                    this._mapNavigation = false;
                }
            );

        this._mapNavigationSubject = this._mapService.mapNavigationSubject;
        this._mapNavigationSubscription = this._mapNavigationSubject
            .subscribe(
                (mapNavigates) => {
                    if (this._layoutService.isMobile()) {
                        this._mapNavigation = mapNavigates;
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
        if (this._layoutService.isMobile()) {
            if (routerState.activatedRouteData['nomap']) {
                stContent = 'st-content-no-map';
            }
        } else if (this.hasSubmenu(routerState)) {
            stContent = 'st-content-sub';
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

    @HostListener('window:scroll', [])
    private _onWindowScroll(): void {
        const offset = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (offset <= 0) {
            this._mapNavigationSubject.next(false);
        }
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
