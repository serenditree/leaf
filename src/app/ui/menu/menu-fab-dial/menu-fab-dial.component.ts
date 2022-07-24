import {Component} from '@angular/core';
import {MenuService} from '../service/menu.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {StAnimations} from '../../../utils/st-animations';
import {Subscription} from 'rxjs';
import {ViewEncapsulation} from '@angular/core';

@Component(
    {
        selector: 'st-menu-fab-dial',
        templateUrl: './menu-fab-dial.component.html',
        styleUrls: ['./menu-fab-dial.component.scss'],
        encapsulation: ViewEncapsulation.None,
        animations: [
            StAnimations.enterFade,
            StAnimations.fabToggle
        ]
    }
)
export class MenuFabDialComponent implements OnInit, OnDestroy {

    private _fabToggleState = StAnimations.STATE_INACTIVE;
    private _fabToggleActiveSubscription: Subscription;

    constructor(private _menuService: MenuService) {
    }

    get fabToggleState(): string {
        return this._fabToggleState;
    }

    get fabToggleActive(): boolean {
        return this._fabToggleState === StAnimations.STATE_ACTIVE;
    }

    ngOnInit(): void {
        this._fabToggleActiveSubscription = this._menuService.isBottomSheetActiveObservable.subscribe(
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
        this._menuService.closeBottomSheet();
        this._fabToggleState = StAnimations.STATE_ACTIVE;
    }

    private _hideItems(): void {
        this._fabToggleState = StAnimations.STATE_INACTIVE;
    }
}
