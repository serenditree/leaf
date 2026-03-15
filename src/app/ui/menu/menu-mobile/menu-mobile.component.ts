import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {FenceService} from '../../../fence/service/fence.service';
import {MenuService} from '../service/menu.service';
import {SearchService} from '../../../search/service/search.service';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-menu-mobile',
        templateUrl: './menu-mobile.component.html',
        styleUrls: ['./menu-mobile.component.scss'],
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

    public close(): void {
        if (!this._isSearchFocused) {
            this._menuService.toggleMenuMobile(true);
        }
    }
}
