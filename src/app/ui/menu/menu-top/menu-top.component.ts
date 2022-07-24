import {Component} from '@angular/core';
import {FenceService} from '../../../fence/service/fence.service';
import {LayoutService} from '../../layout/service/layout.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SearchService} from '../../../search/service/search.service';
import {StAnimations} from '../../../utils/st-animations';
import {Subscription} from 'rxjs/internal/Subscription';
import {ViewEncapsulation} from '@angular/core';

@Component(
    {
        selector: 'st-menu-top',
        templateUrl: './menu-top.component.html',
        styleUrls: ['./menu-top.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: [
            StAnimations.enterFade
        ]
    }
)
export class MenuTopComponent implements OnInit, OnDestroy {

    private _showSearch = false;
    private _isSearchFocusedSubscription: Subscription;

    constructor(private _fenceService: FenceService,
                private _searchService: SearchService,
                private _layoutService: LayoutService,
                private _router: Router) {
    }

    get username(): string {
        return this._fenceService.getUsername() || '';
    }

    get showSearch(): boolean {
        return !this._layoutService.isMobile() && this._showSearch;
    }

    get fenceService(): FenceService {
        return this._fenceService;
    }

    ngOnInit(): void {
        this._isSearchFocusedSubscription = this._searchService
            .isFocusedObservable
            .subscribe(
                (focused) => {
                    this._showSearch = focused;
                }
            );
    }

    ngOnDestroy(): void {
        this._isSearchFocusedSubscription.unsubscribe();
    }

    public toggleSearch(event: Event): void {
        if (event) {
            event.stopPropagation();
        }
        this._showSearch = !this._showSearch;
        this._searchService.setSearchFocus(this._showSearch);
    }
}
