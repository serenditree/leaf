import {Component} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {FilterService} from '../service/filter.service';
import {HostListener} from '@angular/core';
import {MatRadioChange} from '@angular/material/radio';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SearchService} from '../service/search.service';
import {SeedFilter} from '../../seed/model/seed-filter';
import {SeedSortingType} from '../../seed/model/seed-sorting-type.enum';
import {StAnimations} from '../../utils/st-animations';

@Component(
    {
        selector: 'st-filter',
        templateUrl: './filter.component.html',
        styleUrls: ['./filter.component.scss'],
        animations: [
            StAnimations.enterSlideVertical
        ]
    }
)
export class FilterComponent {

    private _isInitialClick = true;

    constructor(private _filterService: FilterService,
                private _searchService: SearchService,
                private _fenceService: FenceService) {
    }

    get filter(): SeedFilter {
        return this._filterService.getFilter();
    }

    get byWater(): SeedSortingType {
        return SeedSortingType.BY_WATER;
    }

    get byNubits(): SeedSortingType {
        return SeedSortingType.BY_NUBITS;
    }

    get byDate(): SeedSortingType {
        return SeedSortingType.BY_DATE;
    }

    get byChance(): SeedSortingType {
        return SeedSortingType.BY_CHANCE;
    }

    get showIsOwnerFilter(): boolean {
        return this._fenceService.isAuthenticated();
    }

    get isOwnerFilterActive(): boolean {
        return this.filter.userId && this.filter.userId === this._fenceService.getUserId();
    }

    get showUserFilter(): boolean {
        return this.filter.userId && this.filter.userId !== this._fenceService.getUserId();
    }

    public apply(): void {
        this._searchService.searchByGlobalFilter();
    }

    public reset(): void {
        this._filterService.resetFilter();
        this.apply();
    }

    public setStrongLocalAlignment(event: MatSlideToggleChange): void {
        console.log(event);
    }

    public setIsPoll(event: MatSlideToggleChange): void {
        this._filterService
            .createQuery()
            .setPoll(event.checked);
    }

    public setIsTrail(event: MatSlideToggleChange): void {
        this._filterService
            .createQuery()
            .setTrail(event.checked);
    }

    public setIsOwner(event: MatSlideToggleChange): void {
        if (event.checked) {
            this._filterService
                .createQuery()
                .setUserId(this._fenceService.getUserId())
                .setUsername(this._fenceService.getUsername()); // TODO Set username too?
        } else {
            this._filterService
                .createQuery()
                .setUserId(null)
                .setUsername(null);
        }
    }

    public resetUser(): void {
        setTimeout(
            () => {
                this._filterService
                    .createQuery()
                    .setUserId(null)
                    .setUsername(null);
            },
            200
        );
    }

    public resetTags(): void {
        setTimeout(
            () => {
                this._filterService
                    .createQuery()
                    .setTags(null);
            },
            200
        );
    }

    public onSortChange(event: MatRadioChange): void {
        this._filterService
            .createQuery()
            .setSort(event.value);
    }

    @HostListener('window:click', ['$event'])
    private _clickWhenFilterFocusedHandler(event: MouseEvent): void {
        if (this._isInitialClick) {
            this._isInitialClick = false;
        } else {
            let isFilterComponent = false;
            for (let element = event.target as HTMLElement;
                 element && !isFilterComponent;
                 element = element.parentElement) {
                if (element.classList.contains('st-map-container-overlay-filter') ||
                    element.id === 'st-filter-reset') {
                    isFilterComponent = true;
                }
            }

            this._filterService.setFilterFocus(isFilterComponent);
        }
    }
}
