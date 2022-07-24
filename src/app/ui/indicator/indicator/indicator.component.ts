import {EXACT_MATCH_FALSE} from '../../../utils/st-const';
import {Component} from '@angular/core';
import {IndicatorService} from '../service/indicator.service';
import {Input} from '@angular/core';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-indicator',
        templateUrl: './indicator.component.html',
        styleUrls: ['./indicator.component.scss']
    }
)
export class IndicatorComponent implements OnInit, OnDestroy {

    private _tooltip: string;
    private _show: boolean;

    private _showProgressSubscription: Subscription;
    private _progressActive = true;

    constructor(private _indicator: IndicatorService,
                private _router: Router) {
    }

    get show(): boolean {
        return this._show;
    }

    @Input()
    set show(value: boolean) {
        this._show = value;
    }

    get tooltip(): string {
        return this._tooltip;
    }

    @Input()
    set tooltip(value: string) {
        this._tooltip = value;
    }

    get progressActive(): boolean {
        return this._progressActive;
    }

    get isGardenView(): boolean {
        return this._router.isActive('/cultivate', EXACT_MATCH_FALSE);
    }

    ngOnInit(): void {
        this._showProgressSubscription = this._indicator.isVisibleObservable.subscribe((active) => {
            this._progressActive = active;
        });
    }

    ngOnDestroy(): void {
        this._showProgressSubscription.unsubscribe();
    }
}
