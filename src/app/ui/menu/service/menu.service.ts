import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {MatBottomSheetRef} from '@angular/material/bottom-sheet';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {MenuBottomComponent} from '../menu-bottom/menu-bottom.component';
import {Observable} from 'rxjs';
import {StAnimations} from '../../../utils/st-animations';

@Injectable({providedIn: 'root'})
export class MenuService {

    private _bottomSheetRef: MatBottomSheetRef;
    private _isMainActive = false;
    private _isFilterActive = false;
    private _bottomSheetActiveSubject = new BehaviorSubject<boolean>(false);

    constructor(private _bottomSheet: MatBottomSheet) {
    }

    get isMainActive(): boolean {
        return this._isMainActive;
    }

    get isFilterActive(): boolean {
        return this._isFilterActive;
    }

    get isBottomSheetActiveObservable(): Observable<boolean> {
        return this._bottomSheetActiveSubject.asObservable();
    }

    public toggleBottomSheet(main: boolean): void {
        if (main && this._isMainActive || !main && this._isFilterActive) {
            this.closeBottomSheet();
        } else {
            if (!this._isMainActive && !this._isFilterActive) {
                this.openBottomSheet(main);
            } else {
                this.closeBottomSheet();
                setTimeout(
                    () => {
                        this.openBottomSheet(main);
                    },
                    StAnimations.COMPLEX_DURATION
                );
            }
        }
    }

    public openBottomSheet(main: boolean): void {
        this._isMainActive = main;
        this._isFilterActive = !main;
        this._bottomSheetRef = this._bottomSheet.open(MenuBottomComponent);
        this._bottomSheetRef
            .backdropClick()
            .subscribe(this.closeBottomSheet.bind(this));
        this._bottomSheetActiveSubject.next(true);
    }

    public closeBottomSheet(): void {
        this._bottomSheet.dismiss();
        this._bottomSheetActiveSubject.next(false);
        setTimeout(
            () => {
                this._isMainActive = false;
                this._isFilterActive = false;
            },
            StAnimations.COMPLEX_DURATION
        );
    }
}
