import {AbstractSeedNewComponent} from './abstract-seed-new.component';
import {Component, OnDestroy, OnInit, inject} from '@angular/core';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {Location} from '@angular/common';
import {MapService} from '../../map/service/map.service';
import {MatSlideToggleChange} from '@angular/material/slide-toggle';
import {SeedService} from '../service/seed.service';
import {Seed} from '../model/seed';
import {StOak} from '../../utils/st-oak';
import {UntypedFormArray, UntypedFormBuilder} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component(
    {
        selector: 'st-seed-new',
        templateUrl: './seed-new.component.html',
        styleUrls: ['./seed-new.component.scss'],
        standalone: false
    }
)
export class SeedNewComponent extends AbstractSeedNewComponent<Seed> implements OnInit, OnDestroy {
    protected _location: Location;
    protected _mapService: MapService;
    private _indicator = inject(IndicatorService);
    private _formBuilder = inject(UntypedFormBuilder);
    private _seedService = inject(SeedService);

    private _startsTrail = false;
    private _parentIsGarden = false;
    private _parentIsTrail = false;
    private _pollsActive = false;
    private _isAnonymous = false;

    constructor() {
        const _location = inject(Location);
        const _mapService = inject(MapService);

        super(_location, _mapService);

        this._location = _location;
        this._mapService = _mapService;
    }

    get isTrail(): boolean {
        return this._parentIsTrail;
    }

    get isInGarden(): boolean {
        return this._parentIsGarden;
    }

    ngOnInit(): void {
        super._onInit();
        const state = this._location.getState();

        if (this._parent) {
            this._parentIsGarden = state['isGarden'];
            this._parentIsTrail = state['isTrail'];
            if (!this._parentIsTrail) {
                this._mapService.setCenter(this._parent.location);
                this._mapService.lock();
            } else {
                this._mapService.removeTrail();
            }
        }

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

            console.debug('Creating seed:', seed);
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
            if (this._parentIsGarden) {
                if (this._parentIsTrail) {
                    seed.trailId = (this._parent.trailId || this._parent.id);
                }
                seed.gardenId = this._parent.id;
                seed.location = this._parent.location;
            } else if (this._parentIsTrail) {
                if (this._parent.trailId) {
                    seed.trailId = this._parent.trailId;
                } else {
                    seed.trailId = this._parent.id;
                }
                seed.trail = true;
            } else {
                if (this._parent.gardenId) {
                    seed.gardenId = this._parent.gardenId;
                }
                seed.parentId = this._parent.id;
                seed.location = this._parent.location;
            }
        } else {
            seed.trail = this._startsTrail;
        }

        seed.anonymous = this._isAnonymous;

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
