import {Injectable} from '@angular/core';
import {ListEvent} from '../model/list-event';
import {ListItemEvent} from '../model/list-item-event';
import {Observable, Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class ListEventService {
    private readonly _listEventSubject = new Subject<ListEvent>();
    private readonly _listItemEventSubject = new Subject<ListItemEvent>();

    get listEventObservable(): Observable<ListEvent> {
        return this._listEventSubject.asObservable();
    }

    get listItemEventObservable(): Observable<ListItemEvent> {
        return this._listItemEventSubject.asObservable();
    }

    public fireListEvent(listEvent: ListEvent): void {
        this._listEventSubject.next(listEvent);
    }

    public fireListItemEvent(listEvent: ListItemEvent): void {
        this._listItemEventSubject.next(listEvent);
    }
}
