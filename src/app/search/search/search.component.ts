import {ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import {LayoutService} from '../../ui/layout/service/layout.service';
import {MatOptionSelectionChange} from '@angular/material/core';
import {SearchService} from '../service/search.service';
import {StUtils} from '../../utils/st-utils';
import {Subscription} from 'rxjs';
import {UntypedFormControl} from '@angular/forms';
import {User} from '../../user/model/user';
import {debounceTime, tap} from 'rxjs/operators';

@Component(
    {
        selector: 'st-search',
        templateUrl: './search.component.html',
        styleUrls: ['./search.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class SearchComponent implements OnInit, OnDestroy {
    private static readonly MAX_TOTAL_RESULTS = 10;

    private _searchService = inject(SearchService);
    private _layoutService = inject(LayoutService);
    private _changeDetection = inject(ChangeDetectorRef);

    private _formControl = new UntypedFormControl();
    private _term = '';
    private _users: User[] = [];
    private _isUserSearch = false;
    private _tags: string[] = [];
    private _isTagSearch = false;
    private _searchTermSubscription: Subscription;
    private _isSearchFocused: boolean;
    private _isSearchFocusedSubscription: Subscription;

    get isMobile(): boolean {
        return this._layoutService.isMobile();
    }

    get formControl(): UntypedFormControl {
        return this._formControl;
    }

    get term(): string {
        return this._term;
    }

    get users(): User[] {
        return this._users;
    }

    get isUserSearch(): boolean {
        return this._isUserSearch;
    }

    get tags(): string[] {
        return this._tags;
    }

    get isTagSearch(): boolean {
        return this._isTagSearch;
    }

    get isSearchFocused(): boolean {
        return this._isSearchFocused;
    }

    ngOnInit(): void {
        this._searchTermSubscription = this._formControl.valueChanges
            .pipe(
                tap(this._checkView.bind(this)),
                debounceTime(1000)
            )
            .subscribe(this._search.bind(this));

        this._isSearchFocusedSubscription = this._searchService
            .isFocusedObservable
            .subscribe(
                (focused) => {
                    this._isSearchFocused = focused;
                }
            );
    }

    ngOnDestroy(): void {
        this._searchTermSubscription.unsubscribe();
        this._isSearchFocusedSubscription.unsubscribe();
    }

    public onUserSelectionChange(selectionChange: MatOptionSelectionChange): void {
        this._searchService.searchByUser(selectionChange.source.value as User);
        this._searchService.setSearchFocus(false);
    }

    public onTagSelectionChange(selectionChange: MatOptionSelectionChange): void {
        this._searchService.searchByTags([selectionChange.source.value]);
        this._searchService.setSearchFocus(false);
    }

    public onFocus(event: FocusEvent): void {
        const focused = event.type === 'focus';
        this._isSearchFocused = focused;
        this._searchService.setSearchFocus(focused);
    }

    private _search(term: string): void {
        if (term && term !== '/' && term !== '#') {
            this._term = term.replace(/^[/#]+/, '');
            if (this._term.length >= SearchService.MIN_TERM_LENGTH) {
                // User search:
                if (term.startsWith('/') || term === this._term) {
                   this._userSearch();
                } else {
                    this._resetUsers();
                }
                // Tag search:
                if (term.startsWith('#') || term === this._term) {
                    this._tagSearch();
                } else {
                    this._resetTags();
                }
                this._balanceResults();
            }
        } else {
            this._term = '';
            this._resetUsers();
            this._resetTags();
        }
        this._checkView();
    }

    private _userSearch(): void {
        this._isUserSearch = true;
        this._searchService.searchUsers(this._term)
            .subscribe(
                (users) => {
                    this._users = users;
                    this._checkView();
                }
            );
    }

    private _tagSearch(): void {
        this._isTagSearch = true;
        this._searchService.searchTags(this._term)
            .subscribe(
                (tags) => {
                    this._tags = tags;
                    this._checkView();
                }
            );
    }

    private _balanceResults(): void {
        if (this._users.length > 5 && this._tags.length > 5) {
            this._users = this._users.slice(0, 5);
            this._tags = this._tags.slice(0, 5);
        } else if (this._users.length > 5 && this._tags.length <= 5) {
            this._users = this._users.slice(0, SearchComponent.MAX_TOTAL_RESULTS - this._tags.length);
        } else if (this._users.length <= 5 && this._tags.length > 5) {
            this._tags = this._tags.slice(0, SearchComponent.MAX_TOTAL_RESULTS - this._users.length);
        }
    }

    private _resetUsers(): void {
        this._isUserSearch = false;
        this._users = [];
    }

    private _resetTags(): void {
        this._isTagSearch = false;
        this._tags = [];
    }

    private _checkView(): void {
        if (this.isMobile) {
            this._changeDetection.markForCheck();
        }
    }

    @HostListener('window:click', ['$event'])
    private _clickWhenSearchFocusedHandler(event: MouseEvent): void {
        if (this.isSearchFocused) {
            if (!StUtils.isChildNode(event.target as HTMLElement, 'st-search-top', 'st-search-bottom')) {
                this._searchService.setSearchFocus(false);
            }
        }
    }
}
