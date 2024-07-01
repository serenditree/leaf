import {AbstractSeedNewComponent} from '../../seed/seed-new/abstract-seed-new.component';
import {Component} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {GardenService} from '../service/garden.service';
import {Garden} from '../model/garden';
import {IndicatorService} from '../../ui/indicator/service/indicator.service';
import {Location} from '@angular/common';
import {MapService} from '../../map/service/map.service';
import {OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';

@Component(
    {
        selector: 'st-garden-new',
        templateUrl: './garden-new.component.html',
        styleUrls: ['./garden-new.component.scss']
    }
)
export class GardenNewComponent extends AbstractSeedNewComponent<Garden> implements OnInit, OnDestroy {

    constructor(protected _location: Location,
                protected _mapService: MapService,
                private _indicator: IndicatorService,
                private _gardenService: GardenService) {
        super(_location, _mapService);
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
