import {AbstractSeed} from '../model/abstract-seed';
import {Location} from '@angular/common';
import {MapService} from '../../map/service/map.service';
import {UntypedFormGroup} from '@angular/forms';

export abstract class AbstractSeedNewComponent<T extends AbstractSeed> {

    protected _formGroup!: UntypedFormGroup;
    protected _submitted = false;
    protected _parent!: T;

    protected constructor(protected _location: Location,
                          protected _mapService: MapService) {
    }

    get formGroup(): UntypedFormGroup {
        return this._formGroup;
    }

    get parent(): T {
        return this._parent;
    }

    get isChild(): boolean {
        return this._parent !== undefined;
    }

    get submitted(): boolean {
        return this._submitted;
    }

    protected _onInit(): void {
        const state = this._location.getState() as Record<string, unknown>;
        this._parent = state['seed'] as T;
    }

    protected _onDestroy(): void {
        this._mapService.unlock();
    }
}
