import {EXACT_MATCH_FALSE} from '../../../utils/st-const';
import {Component, Input, OnDestroy, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import {IndicatorService} from '../service/indicator.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component(
    {
        selector: 'st-indicator',
        templateUrl: './indicator.component.html',
        styleUrls: ['./indicator.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class IndicatorComponent implements OnInit, OnDestroy {
    private readonly _indicator = inject(IndicatorService);
    private readonly _router = inject(Router);

    private _tooltip!: string;
    private _show!: boolean;

    private _showProgressSubscription!: Subscription;
    private _progressActive = true;

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
