import {EXACT_MATCH_FALSE} from '../../../utils/st-const';
import {EXACT_MATCH_TRUE} from '../../../utils/st-const';
import {Component} from '@angular/core';
import {FenceService} from '../../../fence/service/fence.service';
import {FilterService} from '../../../search/service/filter.service';
import {Input} from '@angular/core';
import {LayoutService} from '../../layout/service/layout.service';
import {MenuService} from '../service/menu.service';
import {Router} from '@angular/router';
import {SearchService} from '../../../search/service/search.service';
import {ViewEncapsulation} from '@angular/core';

@Component(
    {
        selector: 'st-menu-sub',
        templateUrl: './menu-sub.component.html',
        styleUrls: ['./menu-sub.component.scss'],
        encapsulation: ViewEncapsulation.None
    }
)
export class MenuSubComponent {

    private _decentralized = false;

    constructor(private _router: Router,
                private _searchService: SearchService,
                private _filterService: FilterService,
                private _layoutService: LayoutService,
                private _menuService: MenuService,
                private _fenceService: FenceService) {
    }

    get decentralized(): boolean {
        return this._decentralized;
    }

    @Input()
    set decentralized(value: boolean) {
        this._decentralized = value;
    }

    get isMobile(): boolean {
        return this._layoutService.isMobile();
    }

    get isFilterFocused(): boolean {
        return this._filterService.getFilterFocus();
    }

    get isFilterModified(): boolean {
        return this._filterService.isModified();
    }

    public toggleFilter(): void {
        if (this._layoutService.isMobile()) {
            this._menuService.toggleBottomSheet(false);
        }
        this._filterService.setFilterFocus(!this._filterService.getFilterFocus());
    }

    public isActive(component: string): boolean {
        let active;

        if (component === 'discover') {
            active = this._router.isActive('/seeds', EXACT_MATCH_TRUE)
                     || this._router.isActive('/gardens', EXACT_MATCH_TRUE);
        } else if (component === 'user') {
            active = this._router.isActive('/user', EXACT_MATCH_FALSE);
        }

        return active;
    }
}
