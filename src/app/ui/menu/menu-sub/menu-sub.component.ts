import {EXACT_MATCH_FALSE, EXACT_MATCH_TRUE} from '../../../utils/st-const';
import {Component, Input, ViewEncapsulation, inject, ChangeDetectionStrategy} from '@angular/core';
import {FenceService} from '../../../fence/service/fence.service';
import {FilterService} from '../../../search/service/filter.service';
import {LayoutService} from '../../layout/service/layout.service';
import {MenuService} from '../service/menu.service';
import {Router} from '@angular/router';
import {SearchService} from '../../../search/service/search.service';

@Component(
    {
        selector: 'st-menu-sub',
        templateUrl: './menu-sub.component.html',
        styleUrls: ['./menu-sub.component.scss'],
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class MenuSubComponent {
    private readonly _router = inject(Router);
    private readonly _searchService = inject(SearchService);
    private readonly _filterService = inject(FilterService);
    private readonly _layoutService = inject(LayoutService);
    private readonly _menuService = inject(MenuService);
    private readonly _fenceService = inject(FenceService);

    private _decentralized = false;

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
            this._menuService.toggleMenuMobile(false);
        }
        this._filterService.setFilterFocus(!this._filterService.getFilterFocus());
    }

    public isActive(component: string): boolean {
        let active = false;

        if (component === 'discover') {
            active = this._router.isActive('/seeds', EXACT_MATCH_TRUE)
                     || this._router.isActive('/gardens', EXACT_MATCH_TRUE);
        } else if (component === 'user') {
            active = this._router.isActive('/user', EXACT_MATCH_FALSE);
        }

        return active;
    }
}
