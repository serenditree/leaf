import {AbstractSeed} from '../model/abstract-seed';
import {Component} from '@angular/core';
import {UntypedFormArray} from '@angular/forms';
import {UntypedFormBuilder} from '@angular/forms';
import {UntypedFormGroup} from '@angular/forms';
import {Input} from '@angular/core';
import {MapService} from '../../map/service/map.service';
import {Observable} from 'rxjs';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {SearchService} from '../../search/service/search.service';
import {StAnimations} from '../../utils/st-animations';
import {StOak} from '../../utils/st-oak';
import {Subscription} from 'rxjs';
import {Validators} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

@Component(
    {
        selector: 'st-seed-new-base',
        templateUrl: './seed-new-base.component.html',
        styleUrls: ['./seed-new-base.component.scss'],
        animations: [
            StAnimations.enterSlideVertical
        ]
    }
)
export class SeedNewBaseComponent implements OnInit, OnDestroy {

    private _parentFormGroup: UntypedFormGroup;
    private _parent: AbstractSeed;
    private _term = '';
    private _tags: Observable<string[]>;
    private _centerSubscription: Subscription;
    private _searchTermSubscription: Subscription;

    constructor(private _mapService: MapService,
                private _searchService: SearchService,
                private _formBuilder: UntypedFormBuilder) {
    }

    get formGroup(): UntypedFormGroup {
        return this._parentFormGroup;
    }

    @Input()
    set formGroup(value: UntypedFormGroup) {
        this._parentFormGroup = value;
    }

    @Input()
    set parent(value: AbstractSeed) {
        this._parent = value;
    }

    get term(): string {
        return this._term;
    }

    get tags(): Observable<string[]> {
        return this._tags;
    }

    get tagsArray(): UntypedFormArray {
        return this._parentFormGroup.get('tags') as UntypedFormArray;
    }

    ngOnInit(): void {
        const initialCenter = this._mapService.getCenter();

        this._parentFormGroup.addControl('location', this._formBuilder.group(
            {
                lng: [
                    {
                        value: initialCenter.lng,
                        disabled: true
                    }
                ],
                lat: [
                    {
                        value: initialCenter.lat,
                        disabled: true
                    }
                ]
            }
        ));
        this._parentFormGroup.addControl('title', this._formBuilder.control('', [Validators.required, StOak.html()]));
        this._parentFormGroup.addControl('text', this._formBuilder.control('', [Validators.required, StOak.html()]));
        this._parentFormGroup.addControl('tags', this._formBuilder.array([]));
        this._parentFormGroup.addControl('tag', this._formBuilder.control('')); // helper

        this._searchTermSubscription = this._parentFormGroup.get('tag').valueChanges
            .pipe(debounceTime(420))
            .subscribe(
                (term) => {
                    if (term && term.length >= SearchService.MIN_TERM_LENGTH) {
                        this._term = term.replace(/^#+/, '');
                        this._tags = this._searchService.searchTags(this._term);
                    }
                }
            );

        if (this.isLocationMutable()) {
            this._centerSubscription = this._mapService.centerObservable.subscribe((center) => {
                this._parentFormGroup.get(['location', 'lng']).setValue(center.lng);
                this._parentFormGroup.get(['location', 'lat']).setValue(center.lat);
            });
        }
    }

    ngOnDestroy(): void {
        this._searchTermSubscription.unsubscribe();
        if (this.isLocationMutable()) {
            this._centerSubscription.unsubscribe();
        }
    }

    public addTag(): void {
        const tagControl = this.formGroup.get('tag');
        // eslint-disable-next-line no-extra-parens
        const tag = (tagControl.value as string).replace(/[^A-Za-z1-9\-+_]/g, '');
        const tagsArray = this._parentFormGroup.get('tags') as UntypedFormArray;

        if (tag.length > 0 && !tagsArray.getRawValue().includes(tag)) {
            tagsArray.push(this._formBuilder.control(tag));
            tagControl.reset();
        } else {
            tagControl.setErrors({invalidTag: true});
            tagControl.markAsTouched();
        }
    }

    public removeTag(index: number): void {
        // eslint-disable-next-line no-extra-parens
        (this._parentFormGroup.get('tags') as UntypedFormArray).removeAt(index);
    }

    public isLocationMutable(): boolean {
        return typeof this._parent === 'undefined' || this._parent['trail'];
    }
}
