import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class IndicatorService {

    private _isVisibleSubject = new BehaviorSubject<boolean>(false);
    private _timeout: any;

    get isVisibleObservable(): Observable<boolean> {
        return this._isVisibleSubject.asObservable();
    }

    public progressStart(): void {
        this._timeout = setTimeout(
            () => {
                this._isVisibleSubject.next(true);
            },
            700
        );

    }

    public progressEnd(): void {
        clearTimeout(this._timeout);
        this._isVisibleSubject.next(false);
    }

}
