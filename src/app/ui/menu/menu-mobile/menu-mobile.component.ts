import {Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import {FenceService} from '../../../fence/service/fence.service';
import {MenuService} from '../service/menu.service';
import {SearchService} from '../../../search/service/search.service';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-menu-mobile',
        templateUrl: './menu-mobile.component.html',
        styleUrls: ['./menu-mobile.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class MenuMobileComponent implements OnInit, OnDestroy {
    private _fenceService = inject(FenceService);
    private _menuService = inject(MenuService);
    private _searchService = inject(SearchService);

    private _isSearchFocused = false;
    private _isSearchFocusedSubscription: Subscription;

    get fenceService(): FenceService {
        return this._fenceService;
    }

    get menuService(): MenuService {
        return this._menuService;
    }

    get isSearchFocused(): boolean {
        return this._isSearchFocused;
    }

    ngOnInit(): void {
        this._isSearchFocusedSubscription = this._searchService
            .isFocusedObservable
            .subscribe(
                (state) => {
                    this._isSearchFocused = state;
                }
            );
    }

    ngOnDestroy(): void {
        this._isSearchFocusedSubscription.unsubscribe();
    }

    public close(event: PointerEvent): void {
        if (this._menuService.isMainActive ||
            !this._isSearchFocused &&
            event.target['classList'].contains('st-menu-mobile')) {
            this._menuService.closeMenuMobile();
        }
    }
}
