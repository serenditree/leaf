import {AbstractSeedNewComponent} from '../../seed/seed-new/abstract-seed-new.component';
import {Component, OnDestroy, OnInit, inject, ChangeDetectionStrategy} from '@angular/core';
import {GardenService} from '../service/garden.service';
import {Garden} from '../model/garden';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {Location} from '@angular/common';
import {MapService} from '../../map/service/map.service';
import {UntypedFormGroup} from '@angular/forms';
import {finalize} from 'rxjs/operators';

@Component(
    {
        selector: 'st-garden-new',
        templateUrl: './garden-new.component.html',
        styleUrls: ['./garden-new.component.scss'],
        changeDetection: ChangeDetectionStrategy.Eager,
        standalone: false
    }
)
export class GardenNewComponent extends AbstractSeedNewComponent<Garden> implements OnInit, OnDestroy {
    protected _location: Location;
    protected _mapService: MapService;
    private readonly _indicator = inject(IndicatorService);
    private readonly _gardenService = inject(GardenService);

    constructor() {
        const _location = inject(Location);
        const _mapService = inject(MapService);

        super(_location, _mapService);
        this._location = _location;
        this._mapService = _mapService;

        this._formGroup = new UntypedFormGroup({});
    }

    ngOnInit(): void {
        super._onInit();
    }

    ngOnDestroy(): void {
        super._onDestroy();
    }

    public onSubmit(): void {
        if (this._formGroup.valid) {
            this._indicator.progressStart();
            this._submitted = true;
            // TODO remove unneeded (not in entity) properties from form.
            this._gardenService.create(this._formGroup.getRawValue())
                .pipe(
                    finalize(
                        () => {
                            this._indicator.progressEnd();
                            this._submitted = false;
                        }
                    )
                )
                .subscribe();
        }
    }
}
