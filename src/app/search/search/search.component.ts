import {ChangeDetectorRef} from '@angular/core';
import {Component} from '@angular/core';
import {FormControl} from '@angular/forms';
import {HostListener} from '@angular/core';
import {LayoutService} from '../../ui/layout/service/layout.service';
import {MatOptionSelectionChange} from '@angular/material/core';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {SearchService} from '../service/search.service';
import {Subscription} from 'rxjs';
import {User} from '../../user/model/user';
import {debounceTime} from 'rxjs/operators';
import {tap} from 'rxjs/operators';

@Component(
    {
        selector: 'st-search',
        templateUrl: './search.component.html',
        styleUrls: ['./search.component.scss']
    }
)
export class SearchComponent implements OnInit, OnDestroy {

    private _formControl = new FormControl();
    private _term = '';
    private _users: User[];
    private _isUserSearch = false;
    private _tags: string[];
    private _isTagSearch = false;
    private _searchTermSubscription: Subscription;
    private _isSearchFocused: boolean;
    private _isSearchFocusedSubscription: Subscription;

    constructor(private _searchService: SearchService,
                private _layoutService: LayoutService,
                private _changeDetection: ChangeDetectorRef) {
    }

    get isMobile(): boolean {
        return this._layoutService.isMobile();
    }

    get formControl(): FormControl {
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
                debounceTime(200)
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
        this._searchService.searchByTags([selectionChange.source.value])
        this._searchService.setSearchFocus(false);
    }

    public onFocus(event: FocusEvent): void {
        this._isSearchFocused = event.returnValue;
        this._searchService.setSearchFocus(event.returnValue);
    }

    private _search(term: string): void {
        if (term && term !== '/' && term !== '#') {
            this._term = term.replace(/^[/#]+/, '');
            if (this._term.length >= SearchService.MIN_TERM_LENGTH) {
                // User search:
                if (term.startsWith('/') || term === this._term) {
                    this._isUserSearch = true;
                    this._searchService.searchUsers(this._term)
                        .subscribe(
                            (users) => {
                                this._users = users;
                                this._checkView();
                            }
                        );
                } else {
                    this._resetUsers();
                }
                // Tag search:
                if (term.startsWith('#') || term === this._term) {
                    this._isTagSearch = true;
                    this._searchService.searchTags(this._term)
                        .subscribe(
                            (tags) => {
                                this._tags = tags;
                                this._checkView();
                            }
                        );
                } else {
                    this._resetTags();
                }
            }
        } else {
            this._term = '';
            this._resetUsers();
            this._resetTags();
        }
        this._checkView();
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
        if (event.target['id'] !== 'st-search-input') {
            this._searchService.setSearchFocus(false);
        }
    }
}
