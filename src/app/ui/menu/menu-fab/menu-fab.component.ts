import {Component, Input, inject, ChangeDetectionStrategy} from '@angular/core';
import {FilterService} from '../../../search/service/filter.service';
import {Location} from '@angular/common';
import {MenuService} from '../service/menu.service';

@Component(
    {
        selector: 'st-menu-fab',
        templateUrl: './menu-fab.component.html',
        styleUrls: ['./menu-fab.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class MenuFabComponent {
    private readonly _menuService = inject(MenuService);
    private readonly _filterService = inject(FilterService);
    private readonly _location = inject(Location);

    private _isElevated = true;
    private _action = '';

    onClick(): void {
        if (this._action === 'back') {
            this._location.back();
        } else {
            this._menuService.toggleMenuMobile(this.action === 'main');
        }
    }

    get menuService(): MenuService {
        return this._menuService;
    }

    get filterService(): FilterService {
        return this._filterService;
    }

    get action(): string {
        return this._action;
    }

    @Input()
    set action(action: string) {
        this._action = action;
    }

    get isElevated(): boolean {
        return this._isElevated;
    }

    @Input()
    set isElevated(value: boolean) {
        this._isElevated = value;
    }
}
