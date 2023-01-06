import {BREAKPOINTS} from '../../../utils/st-const';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Injectable} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {environment} from '../../../../environments/environment';

@Injectable({providedIn: 'root'})
export class LayoutService implements OnDestroy {

    public static readonly MOBILE = BREAKPOINTS.LT_MD;
    public static readonly STANDALONE = '(display-mode: standalone)'

    private readonly _breakpointSubscription: Subscription;

    constructor(private _breakpointObserver: BreakpointObserver,
                private _mediaMatcher: MediaMatcher) {

        if (!environment.production) {
            this._breakpointSubscription = this._breakpointObserver
                .observe(
                    [
                        LayoutService.MOBILE,
                        BREAKPOINTS.XS,
                        BREAKPOINTS.SM,
                        BREAKPOINTS.MD,
                        BREAKPOINTS.LG,
                        BREAKPOINTS.XL
                    ]
                )
                .subscribe(
                    (breakpointState) => {
                        Object
                            .keys(breakpointState.breakpoints)
                            .filter(breakpoint => breakpointState.breakpoints[breakpoint])
                            .forEach(LayoutService._logBreakpoint);
                    }
                );
        }
    }

    private static _logBreakpoint(breakpoint: string): void {
        switch (breakpoint) {
            case LayoutService.MOBILE:
                console.log('Mobile');
                break;
            case BREAKPOINTS.XS:
                console.log('XS');
                break;
            case BREAKPOINTS.SM:
                console.log('SM');
                break;
            case BREAKPOINTS.MD:
                console.log('MD');
                break;
            case BREAKPOINTS.LG:
                console.log('LG');
                break;
            case BREAKPOINTS.XL:
                console.log('XL');
                break;
        }
    }

    ngOnDestroy(): void {
        if (this._breakpointSubscription) {
            this._breakpointSubscription.unsubscribe();
        }
    }

    public matchesMedia(query: string): boolean {
        return this._mediaMatcher
            .matchMedia(query)
            .matches;
    }

    public isMobile(): boolean {
        return this.matchesMedia(LayoutService.MOBILE);
    }

    public isStandalone(): boolean {
        return this.matchesMedia(LayoutService.STANDALONE);
    }
}
