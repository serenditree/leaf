import {Component, Input} from '@angular/core';
import {StAnimations} from '../../st-animations';

@Component(
    {
        selector: 'st-json',
        templateUrl: './json.component.html',
        styleUrls: ['./json.component.scss'],
        animations: [
            StAnimations.slideVertical
        ],
        standalone: false
    }
)
export class JsonComponent {

    private _object: any;
    private _state = StAnimations.STATE_INACTIVE;

    @Input()
    set object(object: any) {
        this._object = object;
    }

    get object(): any {
        return this._object;
    }

    get state(): string {
        return this._state;
    }

    public toggleJson(): void {
        if (this._state === StAnimations.STATE_INACTIVE) {
            this._state = StAnimations.STATE_ACTIVE;
        } else {
            this._state = StAnimations.STATE_INACTIVE;
        }
    }
}
