import {AbstractSeedNewComponent} from './abstract-seed-new.component';
import {Component} from '@angular/core';
import {UntypedFormArray} from '@angular/forms';
import {UntypedFormBuilder} from '@angular/forms';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {Location} from '@angular/common';
import {MapService} from '../../map/service/map.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {SeedService} from '../service/seed.service';
import {Seed} from '../model/seed';
import {StOak} from '../../utils/st-oak';
import {finalize} from 'rxjs/operators';

@Component(
    {
        selector: 'st-seed-new',
        templateUrl: './seed-new.component.html',
        styleUrls: ['./seed-new.component.scss']
    }
)
export class SeedNewComponent extends AbstractSeedNewComponent<Seed> implements OnInit, OnDestroy {

    private _startsTrail = false;
    private _pollsActive = false;
    private _isAnonymous = false;

    constructor(protected _location: Location,
                protected _mapService: MapService,
                private _indicator: IndicatorService,
                private _formBuilder: UntypedFormBuilder,
                private _seedService: SeedService) {
        super(_location, _mapService);
    }

    ngOnInit(): void {
        super._onInit();

        this._formGroup = this._formBuilder.group(
            {
                polls: this._formBuilder.array([])
            }
        );
    }

    ngOnDestroy(): void {
        super._onDestroy();
    }

    public onSubmit(): void {
        if (!this._pollsActive) {
            // disable validation but don't remove.
            this._formGroup.get('polls').disable();
        } else {
            this._toggleHelperValidation(false);
        }

        if (this._formGroup.valid) {
            this._indicator.progressStart();
            this._submitted = true;
            const seed = this._prepareSeed();

            console.log(seed);
            this._seedService.create(seed)
                .pipe(
                    finalize(
                        () => {
                            this._indicator.progressEnd();
                            this._submitted = false;
                        }
                    )
                )
                .subscribe();
        } else {
            this._toggleHelperValidation(true);
            StOak.touch(this._formGroup);
        }
    }

    public onPollToggle(arePollsActive: boolean): void {
        this._formGroup.get('polls').enable();
        this._pollsActive = arePollsActive;
    }

    public onWeakLocalAlignmentToggle(event: MatSlideToggleChange): void {
        this._mapService.weakLocalAlignment(event.checked);
    }

    public onStartsTrailToggle(event: MatSlideToggleChange): void {
        this._startsTrail = event.checked;
    }

    public onAnonymousToggle(event: MatSlideToggleChange): void {
        this._isAnonymous = event.checked;
    }

    private _prepareSeed(): Seed {
        const seed = this._formGroup.getRawValue();

        seed.localAlignment = Math.floor(this._mapService.getZoom());

        if (this._parent) {
            seed.parent = this._parent.id;
            if (this._parentIsGarden) {
                seed.garden = this._parent.id;
                seed.location = this._parent.location;
            } else if (this._parentIsTrail) {
                seed.parent = this._parent.parent || this._parent.id;
                this._startsTrail = true;
            } else {
                seed.location = this._parent.location;
            }
        }

        seed.anonymous = this._isAnonymous;
        seed.trail = this._startsTrail;

        if (!this._pollsActive) {
            seed.polls = [];
        } else {
            // remove helper-control
            seed.polls.forEach((poll) => {
                delete poll['optionInput'];
            });
        }

        // remove helper-control
        delete seed['tag'];

        return seed;
    }

    private _toggleHelperValidation(enable: boolean): void {
        const pollsArray = this._formGroup.get('polls') as UntypedFormArray;
        for (let i = 0; i < pollsArray.length; i++) {
            if (enable) {
                pollsArray.at(i).get('optionInput').enable();
            } else {
                pollsArray.at(i).get('optionInput').disable();
            }
        }
    }
}
