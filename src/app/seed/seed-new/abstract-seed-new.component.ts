import {AbstractSeed} from '../model/abstract-seed';
import {FormGroup} from '@angular/forms';
import {Location} from '@angular/common';
import {MapService} from '../../map/service/map.service';

export abstract class AbstractSeedNewComponent<T extends AbstractSeed> {

    protected _formGroup: FormGroup;
    protected _submitted = false;
    protected _parent: T;
    protected _parentIsGarden = false;
    protected _parentIsTrail = false;

    protected constructor(protected _location: Location,
                          protected _mapService: MapService) {
    }

    get formGroup(): FormGroup {
        return this._formGroup;
    }

    get parent(): T {
        return this._parent;
    }

    get isChild(): boolean {
        return typeof this._parent !== 'undefined';
    }

    get isInGarden(): boolean {
        return this._parentIsGarden;
    }

    get isTrail(): boolean {
        return this._parentIsTrail;
    }

    get submitted(): boolean {
        return this._submitted;
    }

    protected _onInit(): void {
        const state = this._location.getState();

        if (state['seed']) {
            this._parent = state['seed'];
            this._parentIsGarden = state['isGarden'];
            this._parentIsTrail = state['isTrail'];
            if (!this._parentIsTrail) {
                this._mapService.setCenter(this._parent.location);
                this._mapService.lock();
            }
        }
    }

    protected _onDestroy(): void {
        this._mapService.unlock();
    }
}
