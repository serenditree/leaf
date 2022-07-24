import {EXACT_MATCH_FALSE} from '../../../utils/st-const';
import {EXACT_MATCH_TRUE} from '../../../utils/st-const';
import {Component} from '@angular/core';
import {Input} from '@angular/core';
import {LayoutService} from '../../layout/service/layout.service';
import {Router} from '@angular/router';

@Component(
    {
        selector: 'st-menu-main',
        templateUrl: './menu-main.component.html',
        styleUrls: ['./menu-main.component.scss']
    }
)
export class MenuMainComponent {

    private _align: string;

    constructor(private _layoutService: LayoutService,
                private _router: Router) {
    }

    get align(): string {
        return this._align;
    }

    @Input()
    set align(value: string) {
        this._align = value;
    }

    get isMobile(): boolean {
        return this._layoutService.isMobile();
    }

    get isDiscoverActive(): boolean {
        return this._router.isActive('', EXACT_MATCH_TRUE) ||
               this._router.isActive('/seeds', EXACT_MATCH_FALSE) ||
               this._router.isActive('/trail', EXACT_MATCH_FALSE) ||
               this._router.isActive('/gardens', EXACT_MATCH_FALSE);
    }

    public onDiscoverClick(): void {
        void this._router.navigate(['']);
    }
}
