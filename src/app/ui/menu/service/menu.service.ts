import {BehaviorSubject, Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class MenuService {

    private _isMainActive = false;
    private _isFilterActive = false;
    private readonly _isMenuMobileActiveSubject = new BehaviorSubject<boolean>(false);

    get isMainActive(): boolean {
        return this._isMainActive;
    }

    get isFilterActive(): boolean {
        return this._isFilterActive;
    }

    get isMenuMobileActive(): boolean {
        return this._isMenuMobileActiveSubject.getValue();
    }

    get isMenuMobileActiveObservable(): Observable<boolean> {
        return this._isMenuMobileActiveSubject.asObservable();
    }

    public toggleMenuMobile(main: boolean): void {
        if (main && this._isMainActive || !main && this._isFilterActive) {
            this.closeMenuMobile();
        } else {
            this.openMenuMobile(main);
        }
    }

    public openMenuMobile(main: boolean): void {
        this._isMainActive = main;
        this._isFilterActive = !main;
        this._isMenuMobileActiveSubject.next(true);
    }

    public closeMenuMobile(): void {
        this._isMenuMobileActiveSubject.next(false);
        this._isMainActive = false;
        this._isFilterActive = false;
    }
}
