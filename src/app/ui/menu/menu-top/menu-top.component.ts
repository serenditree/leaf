import {Component, OnDestroy, OnInit, ViewEncapsulation, inject} from '@angular/core';
import {FenceService} from '../../../fence/service/fence.service';
import {LayoutService} from '../../layout/service/layout.service';
import {Router} from '@angular/router';
import {SearchService} from '../../../search/service/search.service';
import {Subscription} from 'rxjs/internal/Subscription';

@Component(
    {
        selector: 'st-menu-top',
        templateUrl: './menu-top.component.html',
        styleUrls: ['./menu-top.component.scss'],
        encapsulation: ViewEncapsulation.None,
        standalone: false
    }
)
export class MenuTopComponent implements OnInit, OnDestroy {
    private _fenceService = inject(FenceService);
    private _searchService = inject(SearchService);
    private _layoutService = inject(LayoutService);
    private _router = inject(Router);

    private _showSearch = false;
    private _isSearchFocusedSubscription: Subscription;

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
