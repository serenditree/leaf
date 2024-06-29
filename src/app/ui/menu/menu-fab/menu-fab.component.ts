import {Component} from '@angular/core';
import {FilterService} from '../../../search/service/filter.service';
import {Input} from '@angular/core';
import {Location} from '@angular/common';
import {MenuService} from '../service/menu.service';

@Component(
    {
        selector: 'st-menu-fab',
        templateUrl: './menu-fab.component.html',
        styleUrls: ['./menu-fab.component.scss']
    }
)
export class MenuFabComponent {

    private _isMain = false;
    private _isBack = false;
    private _isElevated = true;

    constructor(private _menuService: MenuService,
                private _filterService: FilterService,
                private _location: Location) {
    }

    goBack(): void {
        this._location.back()
    }

    get menuService(): MenuService {
        return this._menuService;
    }

    get filterService(): FilterService {
        return this._filterService;
    }

    set filterService(value: FilterService) {
        this._filterService = value;
    }

    get isMain(): boolean {
        return this._isMain;
    }

    @Input()
    set isMain(value: boolean) {
        this._isMain = value;
    }

    get isBack(): boolean {
        return this._isBack;
    }

    @Input()
    set isBack(value: boolean) {
        this._isBack = value;
    }

    get isElevated(): boolean {
        return this._isElevated;
    }

    @Input()
    set isElevated(value: boolean) {
        this._isElevated = value;
    }
}
