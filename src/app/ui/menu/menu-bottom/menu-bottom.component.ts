import {Component} from '@angular/core';
import {FenceService} from '../../../fence/service/fence.service';
import {MenuService} from '../service/menu.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {SearchService} from '../../../search/service/search.service';
import {StAnimations} from '../../../utils/st-animations';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-nav-bottom',
        templateUrl: './menu-bottom.component.html',
        styleUrls: ['./menu-bottom.component.scss'],
        animations: [
            StAnimations.fade(.1)
        ]
    }
)
export class MenuBottomComponent implements OnInit, OnDestroy {

    private _isSearchFocused = false;
    private _isSearchFocusedSubscription: Subscription;

    constructor(private _fenceService: FenceService,
                private _menuService: MenuService,
                private _searchService: SearchService) {
    }

    get fenceService(): FenceService {
        return this._fenceService;
    }

    get menuService(): MenuService {
        return this._menuService;
    }

    get isSearchFocused(): boolean {
        return this._isSearchFocused;
    }

    get fadeState(): string {
        return this._isSearchFocused ? StAnimations.STATE_INACTIVE : StAnimations.STATE_ACTIVE;
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
            this._menuService.toggleBottomSheet(true);
        }
    }
}
