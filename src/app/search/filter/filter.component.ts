import {Component, HostListener, inject, ChangeDetectionStrategy} from '@angular/core';
import {FenceService} from '../../fence/service/fence.service';
import {FilterService} from '../service/filter.service';
import {MatRadioChange} from '@angular/material/radio';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SearchService} from '../service/search.service';
import {SeedFilter} from '../../seed/model/seed-filter';
import {SeedSortingType} from '../../seed/model/seed-sorting-type.enum';
import {StUtils} from '../../utils/st-utils';

@Component(
    {
        selector: 'st-filter',
        templateUrl: './filter.component.html',
        styleUrls: ['./filter.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class FilterComponent {
    private _filterService = inject(FilterService);
    private _searchService = inject(SearchService);
    private _fenceService = inject(FenceService);

    private _isInitialClick = true;

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
            this._filterService.setFilterFocus(StUtils.isChildNode(event.target as HTMLElement, 'st-overlay-filter'));
        }
    }
}
