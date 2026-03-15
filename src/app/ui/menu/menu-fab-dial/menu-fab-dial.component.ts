import {Component, OnDestroy, OnInit, ViewEncapsulation, inject} from '@angular/core';
import {MenuService} from '../service/menu.service';
import {StAnimations} from '../../../utils/st-animations';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-menu-fab-dial',
        templateUrl: './menu-fab-dial.component.html',
        styleUrls: ['./menu-fab-dial.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: [
            StAnimations.enterFade,
            StAnimations.fabToggle
        ],
        standalone: false
    }
)
export class MenuFabDialComponent implements OnInit, OnDestroy {
    private _menuService = inject(MenuService);

    private _fabToggleState = StAnimations.STATE_INACTIVE;
    private _fabToggleActiveSubscription: Subscription;

    get fabToggleState(): string {
        return this._fabToggleState;
    }

    get fabToggleActive(): boolean {
        return this._fabToggleState === StAnimations.STATE_ACTIVE;
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
        this._fabToggleState === StAnimations.STATE_ACTIVE ? this._hideItems() : this._showItems();
    }

    private _showItems(): void {
        this._menuService.closeMenuMobile();
        this._fabToggleState = StAnimations.STATE_ACTIVE;
    }

    private _hideItems(): void {
        this._fabToggleState = StAnimations.STATE_INACTIVE;
    }
}
