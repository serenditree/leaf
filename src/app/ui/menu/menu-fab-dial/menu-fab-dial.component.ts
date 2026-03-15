import {Component, OnDestroy, OnInit, ViewEncapsulation, inject} from '@angular/core';
import {MenuService} from '../service/menu.service';
import {Subscription} from 'rxjs';
import {Input} from '@angular/core';

@Component(
    {
        selector: 'st-menu-fab-dial',
        templateUrl: './menu-fab-dial.component.html',
        styleUrls: ['./menu-fab-dial.component.scss'],
        encapsulation: ViewEncapsulation.None,
        standalone: false
    }
)
export class MenuFabDialComponent implements OnInit, OnDestroy {
    private _menuService = inject(MenuService);

    private _fabToggleActive = false;
    private _fabToggleActiveSubscription: Subscription;
    private _icon = 'menu';
    private _right = 10;

    @Input()
    set icon(value: string) {
        this._icon = value;
    }

    get icon(): string {
        return this._icon;
    }

    @Input()
    set right(value: number) {
        this._right = value;
    }

    get right(): number {
        return this._right;
    }

    get fabToggleActive(): boolean {
        return this._fabToggleActive;
    }

    ngOnInit(): void {
        this._fabToggleActiveSubscription = this._menuService.isMenuMobileActiveObservable.subscribe(
            (active) => {
                if (active) {
                    this._hideItems();
                }
            }
        );
    }

    ngOnDestroy(): void {
        this._fabToggleActiveSubscription.unsubscribe();
    }

    public toggleFab(): void {
        this._fabToggleActive ? this._hideItems() : this._showItems();
    }

    private _showItems(): void {
        this._menuService.closeMenuMobile();
        this._fabToggleActive = true;
    }

    private _hideItems(): void {
        this._fabToggleActive = false;
    }
}
