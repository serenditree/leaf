import {Component} from '@angular/core';
import {EventEmitter} from '@angular/core';
import {Input} from '@angular/core';
import {Output} from '@angular/core';
import {StAnimations} from '../../../utils/st-animations';

@Component(
    {
        selector: 'st-toggle',
        templateUrl: './toggle.component.html',
        styleUrls: ['./toggle.component.scss'],
        animations: [
            StAnimations.slideVertical
        ]
    }
)
export class ToggleComponent {

    private _state = StAnimations.STATE_INACTIVE;
    private _name: string;
    private _onToggle = new EventEmitter<boolean>();

    get state(): string {
        return this._state;
    }

    get name(): string {
        return this._name;
    }

    @Input()
    set name(value: string) {
        this._name = value;
    }

    @Output()
    get onToggle(): EventEmitter<boolean> {
        return this._onToggle;
    }

    public onSlideToggle(): void {
        if (this._state === StAnimations.STATE_INACTIVE) {
            this._state = StAnimations.STATE_ACTIVE;
        } else {
            this._state = StAnimations.STATE_INACTIVE;
        }

        this._onToggle.emit(this._state === StAnimations.STATE_ACTIVE);
    }
}
