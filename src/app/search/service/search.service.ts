import {BehaviorSubject} from 'rxjs';
import {FilterService} from './filter.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {SeedService} from '../../seed/service/seed.service';
import {UserService} from '../../user/service/user.service';
import {User} from '../../user/model/user';

@Injectable({providedIn: 'root'})
export class SearchService {

    public static readonly MIN_TERM_LENGTH = 3;

    private _isFocusedSubject = new BehaviorSubject<boolean>(false);

    constructor(private _filterService: FilterService,
                private _userService: UserService,
                private _seedService: SeedService) {
    }

    get isFocusedObservable(): Observable<boolean> {
        return this._isFocusedSubject.asObservable();
    }

    public searchByGlobalFilter(): void {
        this._seedService.retrieveByGlobalFilter();
    }

    public searchByUser(user: User): void {
        this._filterService
            .createQuery()
            .setUserId(user.id)
            .setUsername(user.username);
        this.searchByGlobalFilter();
    }

    public searchByTags(tags: string[]): void {
        this._filterService
            .createQuery()
            .setTags(tags);
        this.searchByGlobalFilter();
    }

    public searchUsers(term: string): Observable<User[]> {
        return this._userService
            .retrieveBySubstring(term);
    }

    public searchTags(term: string): Observable<string[]> {
        return this._seedService
            .retrieveTags(term);
    }

    public setSearchFocus(focused: boolean): void {
        this._isFocusedSubject.next(focused);
    }
}
