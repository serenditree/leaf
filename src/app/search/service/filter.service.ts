import {BehaviorSubject} from 'rxjs';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {SeedFilterBuilder} from '../../seed/model/seed-filter-builder';
import {SeedFilter} from '../../seed/model/seed-filter';

@Injectable({providedIn: 'root'})
export class FilterService {

    private readonly _seedFilterBuilder: SeedFilterBuilder;

    private _isFilterFocusedSubject = new BehaviorSubject<boolean>(false);

    constructor() {
        this._seedFilterBuilder = new SeedFilterBuilder();
    }

    get isFocusedObservable(): Observable<boolean> {
        return this._isFilterFocusedSubject.asObservable();
    }

    public createQuery(): SeedFilterBuilder {
        return this._seedFilterBuilder;
    }

    public getFilter(): SeedFilter {
        return this._seedFilterBuilder.build();
    }

    public resetFilter(): void {
        this._seedFilterBuilder.reset();
    }

    public isModified(): boolean {
        return this._seedFilterBuilder.isModified();
    }

    public getFilterFocus(): boolean {
        return this._isFilterFocusedSubject.getValue();
    }

    public setFilterFocus(focused: boolean): void {
        this._isFilterFocusedSubject.next(focused);
    }
}
