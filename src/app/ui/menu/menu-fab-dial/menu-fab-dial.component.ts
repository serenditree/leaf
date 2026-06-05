import {Component, OnDestroy, OnInit, ViewEncapsulation, inject, ChangeDetectionStrategy} from '@angular/core';
import {MenuService} from '../service/menu.service';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-menu-fab-dial',
        templateUrl: './menu-fab-dial.component.html',
        styleUrls: ['./menu-fab-dial.component.scss'],
        encapsulation: ViewEncapsulation.None,
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class MenuFabDialComponent implements OnInit, OnDestroy {
    private readonly _menuService = inject(MenuService);

    private _fabToggleActive = false;
    private _fabToggleActiveSubscription!: Subscription;

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
